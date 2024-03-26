const pool = require("./connect");

// Function to get a user by ID
async function getUserById(userId) {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT * FROM users WHERE user_id = ?`;
    pool.query(selectQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching user: " + err.stack);
        return reject(err);
      }
      if (results.length === 0) {
        console.error("User not found");
        return reject(new Error("User not found"));
      }
      resolve(results[0]);
    });
  });
}

// Function to get a user by Email and Password
async function getUserByEmailPass(email, password) {
  return new Promise((resolve, reject) => {
    const selectQuery = `SELECT * FROM users WHERE email = ? AND password = ?`;
    pool.query(selectQuery, [email, password], (err, results) => {
      if (err) {
        console.error("Error fetching user: " + err.stack);
        return reject(err);
      }
      if (results.length === 0) {
        console.error("User not found");
        return resolve(null); // Return null when no user is found
      }
      resolve(results[0]);
    });
  });
}

// Function to create a user
async function createUser(userData) {
  return new Promise((resolve, reject) => {
    const { name, email, phone, password } = userData;
    const insertQuery = `INSERT INTO users (name, email, phone, password) VALUES (?, ?, ?, ?)`;
    pool.query(insertQuery, [name, email, phone, password], (err, results) => {
      if (err) {
        console.error("Error creating user: " + err.stack);
        return reject(err);
      }
      console.log("User created successfully");
      const userId = results.insertId; // Get the ID of the newly created user
      // Retrieve the created user by their ID
      getUserById(userId)
        .then((user) => {
          resolve(user); // Resolve with the created user
        })
        .catch((err) => {
          reject(err); // Reject if there's an error retrieving the user
        });
    });
  });
}

async function getAllTransactionsByUserId(userId) {
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
      WHERE u.user_id = ?`;
    pool.query(selectQuery, [userId], (err, results) => {
      if (err) {
        console.error("Error fetching transactions: " + err.stack);
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = {
  getUserById,
  getUserByEmailPass,
  createUser,
  getAllTransactionsByUserId
};
