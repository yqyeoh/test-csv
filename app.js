const express = require('express');
const path = require('path');

const app = express();

const index = require('./routes/index');

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', index);

module.exports = app;
