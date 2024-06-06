const express = require('express');
const dotenv = require('dotenv');
const csvController = require('./controllers/csvController');

dotenv.config();

const app = express();

app.get('/', (req, res) => {
    res.send('CSV to JSON API');
});

app.get('/process-csv', csvController.processCSV);

module.exports = app;
