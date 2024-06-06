const fs = require('fs');

const parseCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                return reject(err);
            }

            const lines = data.split('\n');
            const headers = lines[0].split(',');

            const jsonData = lines.slice(1).map(line => {
                const values = line.split(',');
                const obj = {};
                headers.forEach((header, index) => {
                    const keys = header.split('.');
                    let current = obj;
                    keys.forEach((key, keyIndex) => {
                        if (keyIndex === keys.length - 1) {
                            current[key] = values[index];
                        } else {
                            current[key] = current[key] || {};
                            current = current[key];
                        }
                    });
                });
                return obj;
            });

            resolve(jsonData);
        });
    });
};

module.exports = { parseCSV };
