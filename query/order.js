const pool = require("./connect");

// Function to create an order
async function createOrder(orderData) {
  return new Promise((resolve, reject) => {
    const { userId, productId, quantity, totalAmount } = orderData;
    const insertQuery = `
        INSERT INTO orders (user_id, product_id, quantity, total_amount)
        VALUES (?, ?, ?, ?)
      `;
    pool.query(
      insertQuery,
      [userId, productId, quantity, totalAmount],
      (err, results) => {
        if (err) {
          console.error("Error creating order: " + err.stack);
          return reject(err);
        }
        console.log("Order created successfully");
        const orderId = results.insertId; // Get the ID of the newly created order
        // Resolve with the ID of the created order
        resolve(orderId);
      }
    );
  });
}

module.exports = {
    createOrder
}
