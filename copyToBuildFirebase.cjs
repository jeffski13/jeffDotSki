const path = require('path');
const ncp = require('ncp').ncp;
const fs = require('fs');

// delete everything inside of the destination directory
const deleteOldFilesAndcopyNewFiles = async () => {
    try {
        const srcDir = path.join(__dirname, "build/client");
        const destDir = path.join(__dirname, "firebaseski/public");
        await deleteAllFilesInDirectory(destDir);
        
        await copySourceFiles(srcDir, destDir)
        console.log('Files copied successfully from ' + srcDir + ' to ' + destDir);
    }
    catch (err) {
        console.error('Error during file copy process: ' + err);
    }
};

/**
 * @param {string} srcDir 
 * @param {string} destDir
 */
const copySourceFiles = (srcDir, destDir) => {
    const ncpoptions = {
        "clobber": true
    }
    return new Promise((resolve, reject) => {
        ncp(srcDir, destDir, ncpoptions, function (err) {
            if (err) {
                console.error(`Error copying files from ${srcDir} to ${destDir}:`, err);
                reject(err);
            }
            else{
                console.log(`Directory ncp copy done from ${srcDir} to ${destDir}`);
                resolve();
            }
        });
    });
}

const deleteAllFilesInDirectory = async (directory) => {
    console.log(`Deleting all files in ${directory}...`);
    //check that the directory exists
    if (!fs.existsSync(directory)) {
        console.log('Directory does not exist, nothing to delete.');
        return;
    }
    fs.rmSync(directory, { recursive: true })
    console.log(`All files in ${directory} deleted.`);
};

deleteOldFilesAndcopyNewFiles();