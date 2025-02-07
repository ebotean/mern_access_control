const cors = require('cors');
const express = require('express');
const routes = require('../routes');
const qs = require('qs');
const { createRandomAccess } = require('./access.controller');

const app = express()

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
app.set('query parser', function (str) {
  return qs.parse(str);
});
app.use(routes);

// Creates fake accesses every 7 seconds
let createdAccesses = 0;
setInterval(() => {
  console.log(`Creating random access. ${++createdAccesses} have been created during this session.`);
  createRandomAccess();
}, 7 * 1000);


module.exports = app;