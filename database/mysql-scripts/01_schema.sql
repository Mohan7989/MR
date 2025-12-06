-- ============================================
-- MRCA STUDENTS HUB - MySQL Database Schema
-- Exact match to Base44 entities
-- ============================================

CREATE DATABASE IF NOT EXISTS mrca_students_hub;
USE mrca_students_hub;

-- ========== USERS TABLE (For Authentication) ==========
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role ENUM('USER', 'ADMIN') DEFAULT 'USER',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ========== MATERIALS TABLE ==========
CREATE TABLE materials (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    `group` ENUM('B.A', 'B.Sc', 'B.Com', 'B.B.A', 'All') NOT NULL,
    semester ENUM('1st', '2nd', '3rd', '4th', '5th', '6th') NOT NULL,
    year VARCHAR(10),
    material_type ENUM('Question Paper', 'Notes', 'Lab Material', 'Internship', 'Other') NOT NULL,
    file_url VARCHAR(1000) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    downloads INT DEFAULT 0,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_status (status),
    INDEX idx_group (group),
    INDEX idx_semester (semester),
    INDEX idx_type (material_type),
    INDEX idx_created (created_date DESC)
);

-- ========== NOTICES TABLE ==========
CREATE TABLE notices (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(300) NOT NULL,
    description TEXT NOT NULL,
    is_urgent BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_urgent (is_urgent),
    INDEX idx_created (created_date DESC)
);

-- ========== UPDATES TABLE ==========
CREATE TABLE updates (
    id INT PRIMARY KEY AUTO_INCREMENT,
    message VARCHAR(500) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_created (created_date DESC)
);

-- ========== EXAM TIMETABLES TABLE ==========
CREATE TABLE exam_timetables (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(500) NOT NULL,
    subtitle VARCHAR(300),
    batch VARCHAR(100),
    schedule JSON NOT NULL, -- Storing array of schedule objects as JSON
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_created (created_date DESC)
);

-- ========== SLIDER IMAGES TABLE ==========
CREATE TABLE slider_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    image_url VARCHAR(1000) NOT NULL,
    `order` INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_active (is_active),
    INDEX idx_order (order)
);

-- ========== APP SETTINGS TABLE ==========
CREATE TABLE app_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT,
    is_enabled BOOLEAN DEFAULT TRUE,
    created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_key (setting_key),
    INDEX idx_enabled (is_enabled)
);

-- ========== INSERT DEFAULT SETTINGS ==========
INSERT INTO app_settings (setting_key, setting_value, is_enabled) VALUES
('result_section_enabled', 'true', TRUE),
('result_url', 'https://mracollegevzm.com/exam-results/', TRUE);

-- ========== INSERT DEFAULT ADMIN USER ==========
-- Password: admin123 (bcrypt hashed)
INSERT INTO users (username, email, password_hash, role) VALUES
('admin', 'admin@mrcastudentshub.com', '$2a$10$YourBcryptHashHere', 'ADMIN');