/**
 * server.js
 * Bootstrap server — import semua model agar Sequelize
 * bisa sync tabel ke database, lalu jalankan Express.
 * alter: true — kolom baru otomatis ditambahkan, data tidak hilang.
 * Untuk drop kolom: ubah di model lalu reset manual sekali pakai force: true.
 */
require('dotenv').config();
const app = require('./app.js');
const sequelize = require('./config/database');

require('./models/master-table.model');
require('./models/detail.model');

const PORT = process.env.PORT || 3000;

sequelize.sync({ alter: false }).then(() => {
  console.log('[DB] Database synced');
  app.listen(PORT, () => {
    console.log(`[SERVER] Running at http://localhost:${PORT}`);
    console.log(`\n[AUTH]`);
    console.log(`  POST /api/auth/register`);
    console.log(`  POST /api/auth/login`);
    console.log(`  GET  /api/auth/me`);
    console.log(`\n[MASTER TABLE]`);
    console.log(`  GET/POST /api/master-table/`);
    console.log(`  GET/POST /api/master-table/sub-brand`);
    console.log(`  GET/POST /api/master-table/product`);
    console.log(`\n[DETAIL]`);
    console.log(`  GET/POST /api/detail/leadtime`);
    console.log(`  GET/POST /api/detail/stock-indomaret`);
    console.log(`  GET/POST /api/detail/service-level`);
    console.log(`  GET      /api/detail/service-level/sales-per-brand`);
    console.log(`  GET/POST /api/detail/stock-distributor`);
    console.log(`  GET/POST /api/detail/forecast`);
  });
}).catch(err => {
  console.error('[ERROR] Database sync failed:', err);
});