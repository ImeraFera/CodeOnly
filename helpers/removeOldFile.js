const fs = require('fs');
const path = require('path');

module.exports.removeOldFile = (oldFileName) => {
    if (!oldFileName) {
        console.log('No file name provided');
        return;
    }

    const filePath = path.join(__dirname, '../public/img/', oldFileName);

    fs.unlink(filePath, (err) => {
        if (err) {
            // console.error(`Error deleting file: ${err.message}`);
        } else {
            // console.log(`File successfully deleted: ${filePath}`);
        }
    });
};
