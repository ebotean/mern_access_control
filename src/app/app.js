const cors = require('cors');
const express = require('express');
const routes = require('../routes');

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.use(routes);

// TODO Create fake access update


module.exports = app;