const pool = require("./connect");

async function getAllTransactions() {
  return new Promise((resolve, reject) => {
    const selectQuery = `
      SELECT 
        p.payment_id, 
        m.merchant_id, 
        u.user_id, 
        p.payment_date AS order_date, 
        o.total_amount,
        p.payment_status
      FROM payments p
      JOIN orders o ON p.order_id = o.order_id
      JOIN users u ON o.user_id = u.user_id
      JOIN products pr ON o.product_id = pr.product_id
      JOIN merchants m ON pr.merchant_id = m.merchant_id`;
    pool.query(selectQuery, [], (err, results) => {
      if (err) {
        console.error("Error fetching transactions: " + err.stack);
        return reject(err);
      }
      resolve(results);
    });
  });
}

module.exports = {
  getAllTransactions,
};
