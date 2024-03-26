const pool = require("./connect");

// Function to get all products
async function getAllProducts() {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT * FROM products`;
    pool.query(selectQuery, (err, results) => {
      if (err) {
        console.error("Error fetching products: " + err.stack);
        return reject(err);
      }
      resolve(results);
    });
  });
}

// Function to get a product by ID
async function getProductById(productId) {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT * FROM products WHERE product_id = ?`;
    pool.query(selectQuery, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product: " + err.stack);
        return reject(err);
      }
      if (results.length === 0) {
        console.error("Product not found");
        return reject(new Error("Product not found"));
      }
      resolve(results[0]);
    });
  });
}

// Function to get a product by ID
async function getProductPhotoById(productId) {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT photo_data FROM products WHERE product_id = ?`;
    pool.query(selectQuery, [productId], (err, results) => {
      if (err) {
        console.error("Error fetching product: " + err.stack);
        return reject(err);
      }
      if (results.length === 0) {
        console.error("Product not found");
        return reject(new Error("Product not found"));
      }
      resolve(results[0]);
    });
  });
}

// Function to add a product
async function addProduct(product) {
  return new Promise((resolve, reject) => {
    const insertQuery = `INSERT INTO products 
    (name, description, price, stock_quantity, photo_data, merchant_id) 
    VALUES (?, ?, ?, ?, ?, ?)`;
    const {
      name,
      description,
      price,
      stock_quantity,
      photo_data,
      merchant_id,
    } = product;
    pool.query(
      insertQuery,
      [name, description, price, stock_quantity, photo_data, merchant_id],
      (err, results) => {
        if (err) {
          console.error("Error adding product: " + err.stack);
          return reject(err);
        }
        resolve(results.insertId); // Return the ID of the newly inserted product
      }
    );
  });
}

module.exports = {
  getAllProducts,
  getProductById,
  getProductPhotoById,
  addProduct
};
