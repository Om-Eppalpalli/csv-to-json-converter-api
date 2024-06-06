const csvParser = require('../utils/csvParser');
const pool = require('../config/dbConfig');

const processCSV = async () => {
    const filePath = process.env.CSV_FILE_PATH;
    const jsonData = await csvParser.parseCSV(filePath);
    await insertData(jsonData);
    await calculateAgeDistribution();
};

const insertData = async (jsonData) => {
    const client = await pool.connect();
    try {
        for (const record of jsonData) {
            const name = `${record.name.firstName} ${record.name.lastName}`;
            const age = record.age;
            const address = record.address ? JSON.stringify(record.address) : null;
            const additionalInfo = JSON.stringify(record);

            await client.query(
                `INSERT INTO users (name, age, address, additional_info) VALUES ($1, $2, $3, $4)`,
                [name, age, address, additionalInfo]
            );
        }
    } finally {
        client.release();
    }
};

const calculateAgeDistribution = async () => {
    const client = await pool.connect();
    try {
        const res = await client.query('SELECT age FROM users');
        const ageGroups = { '< 20': 0, '20 to 40': 0, '40 to 60': 0, '> 60': 0 };
        const total = res.rowCount;

        res.rows.forEach(row => {
            const age = row.age;
            if (age < 20) {
                ageGroups['< 20']++;
            } else if (age <= 40) {
                ageGroups['20 to 40']++;
            } else if (age <= 60) {
                ageGroups['40 to 60']++;
            } else {
                ageGroups['> 60']++;
            }
        });

        for (const group in ageGroups) {
            ageGroups[group] = (ageGroups[group] / total * 100).toFixed(2);
        }

        console.log("----------------------------------------------------------");
        console.log('Age-Group % Distribution in Normal Format: ');
        for (const [group, percentage] of Object.entries(ageGroups)) {
            console.log(`${group} -- ${percentage}%`);
        }
        console.log("----------------------------------------------------------");
        console.log("----------------------------------------------------------");
        console.log('Age-Group % Distribution in Tabular Format: ');
        console.table([
            { Sno: 1, AgeGroup: '< 20', Percentage: `${ageGroups['< 20']}%` },
            { Sno: 2, AgeGroup: '20 to 40', Percentage: `${ageGroups['20 to 40']}%` },
            { Sno: 3, AgeGroup: '40 to 60', Percentage: `${ageGroups['40 to 60']}%` },
            { Sno: 4, AgeGroup: '> 60', Percentage: `${ageGroups['> 60']}%` }
        ]);
        console.log("----------------------------------------------------------");
        console.log("Age-Group % Distribution Processed Successfully!!");
        console.log("----------------------------------------------------------");
    } finally {
        client.release();
    }
};

module.exports = { processCSV };
