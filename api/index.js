const express = require('express');
const serverless = require('serverless-http');
const route = require('../routes/client/index.router');
const routeAdmin = require("../routes/admin/index.router");
const database = require('../config/database');

const app = express();

database.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', route);
app.use('/admin', routeAdmin);

module.exports = serverless(app);