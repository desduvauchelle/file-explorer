import fs from 'fs'
import moment from 'moment'

export default {
    getInfo(file = "") {
        let results = false;
        try {
            results = fs.statSync(file);
        } catch (ex) {
            /* eslint-disable */
            console.log(`Failed to analyze: ${file}, Caused by: ${ex}`);
        /* eslint-enable */
        }
        if (results) {
            return {
                isFile: results.isFile(),
                isDirectory: results.isDirectory(),
                size: results.size ? formatBytes(results.size) : null,
                created: results.birthtime ? moment(results.birthtime).format('MMMM Do YYYY, h:mm:ss a') : null,
                modified: results.mtime ? moment(results.mtime).format('MMMM Do YYYY, h:mm:ss a') : null
            }
        }
        return false;
    }
}

function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) {
        return '0 Byte';
    }
    var k = 1000; // or 1024 for binary
    var dm = decimals + 1 || 3;
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    var i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}