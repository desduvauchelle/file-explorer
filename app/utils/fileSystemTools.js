import fs from 'fs'
import moment from 'moment'

const fileSystemTools = {
    getInfo(file = "") {
        let results = false;
        try {
            results = fs.statSync(file);
        } catch (ex) {
            console.log(`Failed to analyze: ${file}, Caused by: ${ex}`); // eslint-disable-line
        }
        if (results) {
            return {
                isFile: results.isFile(),
                isDirectory: results.isDirectory(),
                size: results.size ? fileSystemTools.formatBytes(results.size) : null,
                created: results.birthtime ? moment(results.birthtime).format('MMMM Do YYYY, h:mm:ss a') : null,
                modified: results.mtime ? moment(results.mtime).format('MMMM Do YYYY, h:mm:ss a') : null
            }
        }
        return false;
    },
    getDirectoryListing(path, showHidden = false) {
        try {
            let files = fs.readdirSync(path) || [];
            if (!showHidden) {
                files = files.filter(file => file.charAt(0) !== '.');
            }
            return {
                files: files.sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()))
            };
        } catch (ex) {
            console.log(`Failed to list directory files. path=${path}, caused by: ${ex}`); // eslint-disable-line
            return {
                files: [],
                error: "Permission denied"
            };
        }
    },
    formatBytes(bytes, decimals = 2) {
        if (bytes === 0) {
            return '0 Byte';
        }
        var k = 1000; // or 1024 for binary
        var dm = decimals + 1 || 3;
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
        var i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
}

export default fileSystemTools