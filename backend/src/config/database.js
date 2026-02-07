const { Sequelize } = require('sequelize');
// const { MySqlDialect } = require('@sequelize/mysql');
// require('dotenv').config()

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: './database.sqlite'
});

// const sequelize2 = new Sequelize({
//   dialect: MySqlDialect,
//   database: process.env.MYSQL_DBNAME || 'mydb',
//   user: process.env.MYSQL_USERNAME || 'myuser',
//   password: process.env.MYSQL_PASSWORD || 'mypass',
//   host: process.env.MYSQL_HOST || 'localhost',
//   port: process.env.MYSQL_PORT || 3306,
// });

module.exports =  sequelize;
