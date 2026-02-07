const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MySQL Connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',        // Ganti dengan username MySQL kamu
  password: '',        // Ganti dengan password MySQL kamu
  database: 'indomaret_db'
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error('❌ Error connecting to MySQL:', err);
    return;
  }
  console.log('✅ Connected to MySQL Database!');
});

// Endpoint Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  console.log('Login attempt:', { username, password });

  // Query ke database
  const query = 'SELECT * FROM users WHERE username = ? AND password = ?';
  
  db.query(query, [username, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ 
        success: false,
        message: 'Terjadi kesalahan server!' 
      });
    }

    if (results.length === 0) {
      return res.status(401).json({ 
        success: false,
        message: 'Username atau password salah!' 
      });
    }

    const user = results[0];

    // Login berhasil
    const token = `token-${user.id}-${Date.now()}`;

    res.json({
      success: true,
      message: 'Login berhasil!',
      token: token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role
      }
    });
  });
});

// Endpoint Get Users
app.get('/api/users', (req, res) => {
  const query = 'SELECT id, username, password, role, created_at FROM users';
  
  db.query(query, (err, results) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server!'
      });
    }

    res.json({
      success: true,
      data: results
    });
  });
});

// Endpoint Add User
app.post('/api/users', (req, res) => {
  const { username, password, role } = req.body;

  // Validasi
  if (!username || !password || !role) {
    return res.status(400).json({
      success: false,
      message: 'Username, password, dan role wajib diisi!'
    });
  }

  // Insert ke database
  const query = 'INSERT INTO users (username, password, role) VALUES (?, ?, ?)';
  
  db.query(query, [username, password, role], (err, result) => {
    if (err) {
      // Error duplicate username
      if (err.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({
          success: false,
          message: 'Username sudah digunakan!'
        });
      }
      
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server!'
      });
    }

    res.json({
      success: true,
      message: 'User berhasil ditambahkan!',
      data: {
        id: result.insertId,
        username: username,
        role: role
      }
    });
  });
});

// Endpoint Delete User
app.delete('/api/users/:id', (req, res) => {
  const userId = req.params.id;
  
  const query = 'DELETE FROM users WHERE id = ?';
  
  db.query(query, [userId], (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Terjadi kesalahan server!'
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: 'User tidak ditemukan!'
      });
    }

    res.json({
      success: true,
      message: 'User berhasil dihapus!'
    });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📝 API Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/login`);
  console.log(`   GET  http://localhost:${PORT}/api/users`);
  console.log(`   POST http://localhost:${PORT}/api/users`);
  console.log(`\n👤 Test Credentials:`);
  console.log(`   Username: admin | Password: admin123`);
  console.log(`   Username: user  | Password: user123`);
});