const pool = require("./connect");

// Function to get a merchant by ID
async function getMerchantById(merchId) {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT * FROM merchants WHERE merchant_id = ?`;
    pool.query(selectQuery, [merchId], (err, results) => {
      if (err) {
        console.error("Error fetching merchant: " + err.stack);
        return reject(err);
      }
      if (results.length === 0) {
        console.error("Merchant not found");
        return reject(new Error("Merchant not found"));
      }
      resolve(results[0]);
    });
  });
}

// Function to get a merchant by Email and Password
async function getMerchantByEmailPass(email, password) {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT * FROM merchants WHERE email = ? AND password = ?`;
    pool.query(selectQuery, [email, password], (err, results) => {
      if (err) {
        console.error("Error fetching merchant: " + err.stack);
        return reject(err);
      }
      if (results.length === 0) {
        console.error("Merchant not found");
        return resolve(null); // Return null when no merchant is found
      }
      resolve(results[0]);
    });
  });
}

// Function to create a merchant
async function createMerchant(MerchantData) {
  return new Promise((resolve, reject) => {
    const { name, email, phone, password } = MerchantData;
    const insertQuery = `INSERT INTO merchants (name, email, phone, password) VALUES (?, ?, ?, ?)`;
    pool.query(insertQuery, [name, email, phone, password], (err, results) => {
      if (err) {
        console.error("Error creating merchant: " + err.stack);
        return reject(err);
      }
      console.log("Merchant created successfully");
      const merchId = results.insertId; // Get the ID of the newly created merchant
      // Retrieve the created merchant by their ID
      getMerchantById(merchId)
        .then((merchant) => {
          resolve(merchant); // Resolve with the created merchant
        })
        .catch((err) => {
          reject(err); // Reject if there's an error retrieving the merchant
        });
    });
  });
}

async function getAllTransactionsByMerchId(merchId) {
  return new Promise((resolve, reject) => {
    const selectQuery = `
      SELECT 
        o.product_id, 
        o.order_id,
        p.payment_id,
        p.payment_date AS order_date, 
        o.total_amount,
        p.payment_status
      FROM payments p
      JOIN orders o ON p.order_id = o.order_id
      JOIN users u ON o.user_id = u.user_id
      JOIN products pr ON o.product_id = pr.product_id
      JOIN merchants m ON pr.merchant_id = m.merchant_id
      WHERE m.merchant_id = ?`;
    pool.query(selectQuery, [merchId], (err, results) => {
      if (err) {
        console.error("Error fetching transactions: " + err.stack);
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = {
  getMerchantById,
  getMerchantByEmailPass,
  createMerchant,
  getAllTransactionsByMerchId
};
