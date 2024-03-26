const pool = require("./connect");

// Function to create a payment record
async function createPayment(paymentData) {
  return new Promise((resolve, reject) => {
    const { orderPlaceId, amount, paymentStatus } = paymentData;
    const insertQuery = `
        INSERT INTO payments (order_id, amount, payment_status)
        VALUES (?, ?, ?)
      `;
    pool.query(
      insertQuery,
      [orderPlaceId, amount, paymentStatus],
      (err, results) => {
        if (err) {
          console.error("Error creating payment: " + err.stack);
          return reject(err);
        }
        console.log("Payment created successfully");
        const paymentId = results.insertId; // Get the ID of the newly created payment record
        // Resolve with the ID of the created payment record
        resolve(paymentId);
      }
    );
  });
}

// Function to update the status of a payment record
async function updatePaymentStatus(paymentId, newStatus) {
    return new Promise((resolve, reject) => {
      const updateQuery = `
        UPDATE payments
        SET payment_status = ?
        WHERE payment_id = ?
      `;
      pool.query(updateQuery, [newStatus, paymentId], (err, results) => {
        if (err) {
          console.error("Error updating payment status: " + err.stack);
          return reject(err);
        }
        console.log("Payment status updated successfully");
        resolve(); // Resolve without returning any data
      });
    });
  }

module.exports = {
  createPayment,
  updatePaymentStatus
};