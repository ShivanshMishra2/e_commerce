const dotenv = require("dotenv");
const mysql = require("mysql");

dotenv.config(); // Load environment variables from .env file

// Create a MySQL connection
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Connect to MySQL server
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + connection.threadId);

  // Create database and tables
  createDatabaseAndTables();
});

// Function to create database and tables
function createDatabaseAndTables() {
  // Create the database if it doesn't exist
  const createDatabaseQuery =
    "CREATE DATABASE IF NOT EXISTS " + process.env.DB_DATABASE;
  executeQuery(
    createDatabaseQuery,
    "Database creation successful",
    "Error creating database"
  );

  // Use the specified database
  const useDatabaseQuery = "USE " + process.env.DB_DATABASE;
  executeQuery(
    useDatabaseQuery,
    "Database selected successfully",
    "Error selecting database"
  );

  // Define the SQL statement to create the users table
  const createusersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
        user_id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        phone VARCHAR(20) UNIQUE,
        password VARCHAR(255) NOT NULL
    )
   `;
  executeQuery(
    createusersTableQuery,
    "Users table created successfully",
    "Error creating users table"
  );

  // Define the SQL statement to create the merchants table
  const createMerchantsTableQuery = `
  CREATE TABLE IF NOT EXISTS merchants (
      merchant_id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      email VARCHAR(255) UNIQUE NOT NULL,
      phone VARCHAR(20) UNIQUE,
      password VARCHAR(255) NOT NULL
  )
`;
  executeQuery(
    createMerchantsTableQuery,
    "Merchants table created successfully",
    "Error creating merchants table"
  );

  // Define the SQL statement to create the products table
  const createProductsTableQuery = `
  CREATE TABLE IF NOT EXISTS products (
    product_id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INT NOT NULL,
    photo_data VARCHAR(255), 
    merchant_id INT,
    FOREIGN KEY (merchant_id) REFERENCES merchants(merchant_id) ON DELETE CASCADE ON UPDATE CASCADE
  )
`;
  executeQuery(
    createProductsTableQuery,
    "Products table created successfully",
    "Error creating products table"
  );

  // Define the SQL statement to create the orders table
  const createOrdersTableQuery = `
  CREATE TABLE IF NOT EXISTS orders (
      order_id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT,
      product_id INT,
      quantity INT NOT NULL,
      order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      total_amount DECIMAL(10, 2) NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY (product_id) REFERENCES products(product_id) ON DELETE CASCADE ON UPDATE CASCADE
  )
`;

  executeQuery(
    createOrdersTableQuery,
    "Orders table created successfully",
    "Error creating orders table"
  );

  // Define the SQL statement to create the payments table
  const createPaymentsTableQuery = `
  CREATE TABLE IF NOT EXISTS payments (
      payment_id INT AUTO_INCREMENT PRIMARY KEY,
      order_id INT,
      payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      amount DECIMAL(10, 2) NOT NULL,
      payment_status ENUM('pending', 'completed', 'failed') NOT NULL,
      FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE ON UPDATE CASCADE
  )
`;
  executeQuery(
    createPaymentsTableQuery,
    "Payments table created successfully",
    "Error creating payments table"
  );

  // Close the connection
  connection.end((err) => {
    if (err) {
      console.error("Error closing connection: " + err.stack);
      return;
    }
    console.log("Connection closed");
  });
}

// Function to execute SQL queries
function executeQuery(query, successMessage, errorMessage) {
  connection.query(query, (err, results) => {
    if (err) {
      console.error(errorMessage + ": " + err.stack);
      return;
    }
    console.log(successMessage);
  });
}
