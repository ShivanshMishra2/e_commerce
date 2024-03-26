const express = require("express");
const ejsMate = require("ejs-mate");
const bodyParser = require("body-parser");
const path = require("path");

const {
  getUserById,
  getUserByEmailPass,
  getAllTransactionsByUserId
} = require("./query/users");

const {
  getMerchantById,
  getMerchantByEmailPass,
  createMerchant,
  getAllTransactionsByMerchId
} = require("./query/merchant");

const { getAllProducts, getProductById, getProductPhotoById, addProduct } = require("./query/product");
const { createOrder } = require("./query/order");
const { createPayment, updatePaymentStatus } = require("./query/payment");

const { getAllTransactions } = require("./query/bank");

const app = express();

app.engine("ejs", ejsMate); // Set ejsMate as the view engine
app.set("view engine", "ejs"); // Set EJS as the view engine

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files from the 'public' directory\
app.use('/images', express.static('Gallery'));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/userlogin", (req, res) => {
  res.render("user/login");
});

app.post("/userlogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await getUserByEmailPass(email, password);
    if (user) {
      res.redirect(`/user/${user.user_id}/dashboard`);
    } else {
      res.render("user/login", { error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/user/:userId/dashboard", async (req, res) => {
  try {
    const userId = req.params.userId;
    const user = await getUserById(userId);
    if (!user) {
      return res.status(404).render("error", { message: "User not found" });
    }
    const allProducts = await getAllProducts();
    res.render("user/dashboard", { user, allProducts });
  } catch (error) {
    console.error("Error in /user/:userId/dashboard:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
});

app.get("/user/:userId/buy/:productId", async (req, res) => {
  const quantity = 1;
  const product = await getProductById(req.params.productId);
  const user = await getUserById(req.params.userId);
  console.log(quantity);
  res.render("user/checkout", { product, user, quantity });
});

app.get("/user/:userId/buy/:productId/payment/:amount", async (req, res) => {
  const product = await getProductById(req.params.productId);
  const user = await getUserById(req.params.userId);
  const totalAmount = req.params.amount;
  res.render("user/pay", { product, user, totalAmount });
});

app.post("/user/:userId/buy/:productId/payment/:amount", async (req, res) => {
  const userId = req.params.userId;
  const productId = req.params.productId;
  const totalAmount = req.params.amount;
  const quantity = 1;

  const orderPlaceId = await createOrder({
    userId,
    productId,
    totalAmount,
    quantity,
  });
  if (orderPlaceId) {
    const paymentStatus = "pending";
    const amount = totalAmount;
    const paymentId = await createPayment({
      orderPlaceId,
      amount,
      paymentStatus,
    });
    if (paymentId) {
      res.redirect(`/user/${userId}/dashboard`);
    }
  }
});

app.get("/user/:userId/history", async (req, res) => {
  const transactions = await getAllTransactionsByUserId(req.params.userId);
  res.render("user/history", {transactions: transactions});
});

app.get("/merchantlogin", (req, res) => {
  res.render("merchant/login");
});

app.post("/merchantlogin", async (req, res) => {
  const { email, password } = req.body;
  try {
    const merchant = await getMerchantByEmailPass(email, password);
    if (merchant) {
      res.redirect(`/merchant/${merchant.merchant_id}/dashboard`);
    } else {
      res.render("merchant/login", { error: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send("Internal Server Error");
  }
})

app.get("/merchant/:merchId/dashboard", async (req, res) => {
  try {
    const merchant = await getMerchantById(req.params.merchId);
    if (!merchant) {
      return res.status(404).render("error", { message: "Merch not found" });
    }
    const products = await getAllProducts();
    res.render("merchant/dashboard", { merchant, products });
  } catch (error) {
    console.error("Error in /merchant/:merchId/dashboard:", error);
    res.status(500).render("error", { message: "Internal Server Error" });
  }
})

app.get("/merchant/:merchId/history", async (req, res) => {
  const transactions = await getAllTransactionsByMerchId(req.params.merchId);
  const merchant = await getMerchantById(req.params.merchId);
  res.render("merchant/history", {merchant, transactions: transactions});
});

// Assuming you have a route to render the add product form
app.get("/merchant/:merchId/addProduct", (req, res) => {
  const merchId = req.params.merchId;
  res.render("merchant/addProduct", { merchId: merchId });
});

app.post("/merchant/:merchId/addProduct", async (req, res) => {
  const {name, description, price, stock_quantity, photo_data} = req.body;
  const merchant_id = req.params.merchId;
  const newProduct = await addProduct({name, description, price, stock_quantity, photo_data, merchant_id});
  if(newProduct) {
    res.redirect(`/merchant/${merchant_id}/dashboard`)
  } else {
    res.redirect(`/merchant/${merchant_id}/dashboard`)
  }
})

app.get("/bank", async (req, res) => {
  try {
    const transactions = await getAllTransactions();
    res.render("bank/index", { transactions: transactions });
  } catch (error) {
    console.error("Error retrieving transactions:", error);
    res.status(500).send("An error occurred while fetching transactions.");
  }
});

app.post("/bank/transaction/:paymentId/accept", async (req, res) => {
  const payment_status = "completed";
  await updatePaymentStatus(req.params.paymentId, payment_status);
  res.redirect("/bank");
});

app.post("/bank/transaction/:paymentId/reject", async (req, res) => {
  const payment_status = "failed";
  await updatePaymentStatus(req.params.paymentId, payment_status);
  res.redirect("/bank");
});

app.get('/displayImage/:productId', async (req, res) => {
  try {
    const productId = req.params.productId;
    const productPhoto = await getProductPhotoById(productId);
    // Set content type
    res.set('Content-Type', 'image/jpeg'); 
    // Send the image data
    res.send(productPhoto.photo_data);
  } catch (error) {
    console.error('Error sending image:', error);
    res.status(500).send('Internal Server Error');
  }
});

const port = process.env.DB_PORT;
app.listen(port, () =>
  console.log(`Server is running on :- http://localhost:${port}`)
);
