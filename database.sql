-- SmartPark EPMS Database Setup Script
-- Run this script in MySQL to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS epms;
USE epms;

-- Drop tables if they exist (for clean setup)
DROP TABLE IF EXISTS salary;
DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS department;
DROP TABLE IF EXISTS users;

-- Create Department table
CREATE TABLE department (
  DepartementCode VARCHAR(10) PRIMARY KEY,
  DepartementName VARCHAR(100) NOT NULL,
  GrossSalary DECIMAL(12, 2) NOT NULL,
  TotalDeduction DECIMAL(12, 2) NOT NULL
);

-- Create Employee table
CREATE TABLE employee (
  employeeNumber VARCHAR(20) PRIMARY KEY,
  FirstName VARCHAR(50) NOT NULL,
  LastName VARCHAR(50) NOT NULL,
  Address VARCHAR(200),
  Position VARCHAR(100),
  Telephone VARCHAR(20),
  Gender VARCHAR(10),
  hiredDate DATE,
  DepartmentCode VARCHAR(10),
  FOREIGN KEY (DepartmentCode) REFERENCES department(DepartementCode)
);

-- Create Salary table
CREATE TABLE salary (
  id INT AUTO_INCREMENT PRIMARY KEY,
  employeeNumber VARCHAR(20) NOT NULL,
  GlossSalary DECIMAL(12, 2) NOT NULL,
  TotalDeduction DECIMAL(12, 2) NOT NULL,
  NetSalary DECIMAL(12, 2) NOT NULL,
  month VARCHAR(20) NOT NULL,
  FOREIGN KEY (employeeNumber) REFERENCES employee(employeeNumber)
);

-- Create Users table for login
CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- Insert default departments
INSERT INTO department (DepartementCode, DepartementName, GrossSalary, TotalDeduction) VALUES
('CW', 'Carwash', 300000, 20000),
('ST', 'Stock', 200000, 5000),
('MC', 'Mechanic', 450000, 40000),
('ADMS', 'Administration', 600000, 70000);

-- Insert default user (username: admin, password: admin123)
INSERT INTO users (username, password) VALUES
('admin', 'admin123');

-- Show tables
SHOW TABLES;