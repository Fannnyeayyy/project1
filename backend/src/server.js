require('dotenv').config();
const app  = require("./app.js");
const sequelize = require("./config/database");
const PORT = process.env.PORT || 3020;

sequelize.sync().then(() => {
  console.log("Database synced");
  app.listen(PORT, () => {
    console.log("Server running http://localhost:3000");
    console.log(`📝 API Endpoints:`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   GET  http://localhost:${PORT}/api/auth/me`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
  });
});
