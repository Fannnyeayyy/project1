/**
 * server.js
 * Bootstrap server — import semua model agar Sequelize
 * bisa sync tabel ke database, lalu jalankan Express.
 * Gunakan `alter: true` supaya kolom baru otomatis ditambahkan
 * tanpa menghapus data yang sudah ada.
 */
require('dotenv').config();
const app = require('./app.js');
const sequelize = require('./config/database');

// Import semua model agar ter-sync ke database
require('./models/master-table.model');
require('./models/detail.model');

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: true }).then(() => {
  console.log('✅ Database synced');
  app.listen(PORT, () => {
    console.log(` Server running http://localhost:${PORT}`);
    console.log(`\n Auth Endpoints:`);
    console.log(`   POST http://localhost:${PORT}/api/auth/register`);
    console.log(`   POST http://localhost:${PORT}/api/auth/login`);
    console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
    console.log(`\n Master Table Endpoints:`);
    console.log(`   GET/POST http://localhost:${PORT}/api/master-table/`);
    console.log(`   GET/POST http://localhost:${PORT}/api/master-table/sub-brand`);
    console.log(`   GET/POST http://localhost:${PORT}/api/master-table/product`);
    console.log(`\n Detail Endpoints:`);
    console.log(`   GET/POST http://localhost:${PORT}/api/detail/leadtime`);
    console.log(`   GET/POST http://localhost:${PORT}/api/detail/stock-indomaret`);
    console.log(`   GET/POST http://localhost:${PORT}/api/detail/service-level`);
    console.log(`   GET      http://localhost:${PORT}/api/detail/service-level/sales-per-brand`);
    console.log(`   GET/POST http://localhost:${PORT}/api/detail/stock-distributor`);
  });
}).catch(err => {
  console.error(' Database sync failed:', err);
});