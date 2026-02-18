/**
 * app.js
 * Entry point konfigurasi Express.
 * Di sini semua middleware global (cors, json parser) dan
 * routing utama didaftarkan. Tambahkan route baru di sini.
 */
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/master-table', require('./modules/master-table/master.routes'));
app.use('/api/detail', require('./modules/detail/detail.routes'));

module.exports = app;