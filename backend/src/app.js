const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./modules/auth/auth.routes'));
app.use('/api/master-table', require('./modules/master-table/master.routes'));

module.exports = app;
