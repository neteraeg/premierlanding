-- Create database and user
CREATE DATABASE IF NOT EXISTS u305610349_premier;
CREATE USER IF NOT EXISTS 'u305610349_premier'@'localhost' IDENTIFIED BY 'g8mkrJS&S';
GRANT ALL PRIVILEGES ON u305610349_premier.* TO 'u305610349_premier'@'localhost';
FLUSH PRIVILEGES;

USE u305610349_premier;

-- Visitor logs table
CREATE TABLE IF NOT EXISTS visitor_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NOT NULL,
    user_agent TEXT NOT NULL,
    phone_number VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Leads table (if needed by other parts of the application)
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
