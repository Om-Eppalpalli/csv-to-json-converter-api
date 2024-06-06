const csvService = require('../services/csvService');

const processCSV = async (req, res) => {
    try {
        await csvService.processCSV();
        res.send('CSV data processed and age distribution calculated.');
    } catch (err) {
        console.error(err);
        res.status(500).send('An error occurred.');
    }
};

module.exports = { processCSV };
