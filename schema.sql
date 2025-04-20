-- SQL schema for the landing page leads table

-- Ensure you are connected to the correct database (u305610349_premier) before running this.

-- Drop the table if it already exists (optional, use with caution)
-- DROP TABLE IF EXISTS leads;

-- Create the leads table
CREATE TABLE IF NOT EXISTS leads (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Optional: Add an index on email if you expect many lookups by email
-- CREATE INDEX idx_email ON leads(email);

-- Optional: Add an index on phone if you expect many lookups by phone
-- CREATE INDEX idx_phone ON leads(phone);


-- Create the visitor_logs table
CREATE TABLE IF NOT EXISTS visitor_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45) NULL, -- Store IPv4 or IPv6
    user_agent TEXT NULL,        -- Store the full user agent string
    phone_number VARCHAR(50) NULL, -- Optional phone number from initial step
    visit_timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lead_id INT NULL,            -- Optional: Link to the leads table if submission is successful
    FOREIGN KEY (lead_id) REFERENCES leads(id) ON DELETE SET NULL -- Optional foreign key
);

-- Optional: Index IP address for faster lookups
-- CREATE INDEX idx_ip_address ON visitor_logs(ip_address);
