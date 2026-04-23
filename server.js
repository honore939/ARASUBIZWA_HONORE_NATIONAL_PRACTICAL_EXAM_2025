const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors({\n  credentials: true,\n  origin: 'http://localhost:5173'\n}));\n\n// Auth Middleware\nfunction requireAuth(req, res, next) {\n  if (req.session.userId) {\n    next();\n  } else {\n    res.status(401).json({ error: 'Unauthorized' });\n  }\n}\n\nfunction requireAdmin(req, res, next) {\n  db.query('SELECT role FROM users WHERE id = ?', [req.session.userId], (err, results) => {\n    if (err || results.length === 0 || results[0].role !== 'admin') {\n      return res.status(403).json({ error: 'Admin access required' });\n    }\n    req.userRole = results[0].role;\n    next();\n  });\n}
app.use(bodyParser.json());
app.use(session({
  secret: 'smartpark_epms_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

// MySQL Database Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'epms'
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err.message);
  } else {
    console.log('Connected to MySQL database');
  }
});

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  
  const query = 'SELECT * FROM users WHERE username = ?';
  db.query(query, [username], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    
    if (results.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = results[0];\n    if (bcrypt.compareSync(password, user.password)) {\n      req.session.userId = user.id;\n      req.session.username = user.username;\n      req.session.role = user.role;\n      return res.json({ message: 'Login successful', user: { id: user.id, username: user.username, role: user.role } });\n    } else {\n      return res.status(401).json({ error: 'Invalid credentials' });\n    }
  });
});

// Logout
app.post('/api/logout', (req, res) => {
  req.session.destroy();
  res.json({ message: 'Logged out successfully' });
});

// Check session
app.get('/api/session', (req, res) => {\n  if (req.session.userId) {\n    res.json({ authenticated: true, username: req.session.username, role: req.session.role });\n  } else {\n    res.json({ authenticated: false });\n  }\n});

// ==================== DEPARTMENT ROUTES ====================

// Get all departments
app.get('/api/departments', (req, res) => {
  const query = 'SELECT * FROM department ORDER BY DepartementCode';
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add department
app.post('/api/departments', (req, res) => {
  const { DepartementCode, DepartementName, GrossSalary, TotalDeduction } = req.body;
  const query = 'INSERT INTO department (DepartementCode, DepartementName, GrossSalary, TotalDeduction) VALUES (?, ?, ?, ?)';
  db.query(query, [DepartementCode, DepartementName, GrossSalary, TotalDeduction], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Department added successfully', id: result.insertId });
  });
});

// Update department
app.put('/api/departments/:code', (req, res) => {
  const { DepartementName, GrossSalary, TotalDeduction } = req.body;
  const query = 'UPDATE department SET DepartementName = ?, GrossSalary = ?, TotalDeduction = ? WHERE DepartementCode = ?';
  db.query(query, [DepartementName, GrossSalary, TotalDeduction, req.params.code], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Department updated successfully' });
  });
});

// Delete department
app.delete('/api/departments/:code', (req, res) => {
  const query = 'DELETE FROM department WHERE DepartementCode = ?';
  db.query(query, [req.params.code], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Department deleted successfully' });
  });
});

// ==================== EMPLOYEE ROUTES ====================

// Get all employees
app.get('/api/employees', (req, res) => {
  const query = `
    SELECT e.*, d.DepartementName 
    FROM employee e 
    LEFT JOIN department d ON e.DepartmentCode = d.DepartementCode 
    ORDER BY e.employeeNumber
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add employee
app.post('/api/employees', (req, res) => {
  const { employeeNumber, FirstName, LastName, Address, Position, Telephone, Gender, hiredDate, DepartmentCode } = req.body;
  const query = `
    INSERT INTO employee (employeeNumber, FirstName, LastName, Address, Position, Telephone, Gender, hiredDate, DepartmentCode) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(query, [employeeNumber, FirstName, LastName, Address, Position, Telephone, Gender, hiredDate, DepartmentCode], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Employee added successfully', id: result.insertId });
  });
});

// Update employee
app.put('/api/employees/:id', (req, res) => {
  const { FirstName, LastName, Address, Position, Telephone, Gender, hiredDate, DepartmentCode } = req.body;
  const query = `
    UPDATE employee 
    SET FirstName = ?, LastName = ?, Address = ?, Position = ?, Telephone = ?, Gender = ?, hiredDate = ?, DepartmentCode = ? 
    WHERE employeeNumber = ?
  `;
  db.query(query, [FirstName, LastName, Address, Position, Telephone, Gender, hiredDate, DepartmentCode, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Employee updated successfully' });
  });
});

// Delete employee
app.delete('/api/employees/:id', (req, res) => {
  const query = 'DELETE FROM employee WHERE employeeNumber = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Employee deleted successfully' });
  });
});

// ==================== SALARY ROUTES ====================

// Get all salary records
app.get('/api/salaries', (req, res) => {
  const query = `
    SELECT s.*, e.FirstName, e.LastName, e.Position, d.DepartementName
    FROM salary s
    LEFT JOIN employee e ON s.employeeNumber = e.employeeNumber
    LEFT JOIN department d ON e.DepartmentCode = d.DepartementCode
    ORDER BY s.id DESC
  `;
  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Add salary
app.post('/api/salaries', (req, res) => {
  const { employeeNumber, GlossSalary, TotalDeduction, NetSalary, month } = req.body;
  const query = 'INSERT INTO salary (employeeNumber, GlossSalary, TotalDeduction, NetSalary, month) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [employeeNumber, GlossSalary, TotalDeduction, NetSalary, month], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Salary added successfully', id: result.insertId });
  });
});

// Update salary
app.put('/api/salaries/:id', (req, res) => {
  const { GlossSalary, TotalDeduction, NetSalary, month } = req.body;
  const query = 'UPDATE salary SET GlossSalary = ?, TotalDeduction = ?, NetSalary = ?, month = ? WHERE id = ?';
  db.query(query, [GlossSalary, TotalDeduction, NetSalary, month, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Salary updated successfully' });
  });
});

// Delete salary
app.delete('/api/salaries/:id', (req, res) => {
  const query = 'DELETE FROM salary WHERE id = ?';
  db.query(query, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Salary deleted successfully' });
  });
});

// ==================== REPORTS ROUTES ====================

// Monthly payroll report
app.get('/api/reports/monthly-payroll', (req, res) => {
  const { month } = req.query;
  let query = `
    SELECT e.employeeNumber, e.FirstName, e.LastName, e.Position, d.DepartementName, d.GrossSalary, d.TotalDeduction,
           s.NetSalary, s.month
    FROM employee e
    LEFT JOIN department d ON e.DepartmentCode = d.DepartementCode
    LEFT JOIN salary s ON e.employeeNumber = s.employeeNumber
  `;
  
  let params = [];
  if (month) {
    query += ' WHERE s.month = ?';
    params.push(month);
  }
  
  query += ' ORDER BY e.employeeNumber';
  
  db.query(query, params, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});