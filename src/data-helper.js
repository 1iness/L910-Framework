const fs = require('fs');
const path = require('path');

const getPath = (filename) => path.join(__dirname, '..', 'data', filename);

module.exports = {
    readData: (fileName) => {
        return new Promise((resolve, reject) => {
            const filePath = getPath(fileName);
            console.log(`[DEBUG] Reading file from: ${filePath}`); 
            fs.readFile(filePath, 'utf-8', (err, data) => {
                if (err) {
                    console.error(`[ERROR] File not found: ${filePath}`);
                    reject(err);
                } else {
                    try {
                        resolve(JSON.parse(data));
                    } catch (parseError) {
                        reject(parseError);
                    }
                }
            });
        });
    },
    writeData: (fileName, data) => {
        return new Promise((resolve, reject) => {
            const filePath = getPath(fileName);
            fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }
};