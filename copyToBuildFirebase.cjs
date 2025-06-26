const path = require('path');
const ncp = require('ncp').ncp;
const fs = require('fs');

let srcDir = path.join(__dirname, "build/client");

let destDir = path.join(__dirname, "firebaseski/public");

var ncpoptions = {
    "clobber": true
}

// delete everything inside of the destination directory
const deleteOldFilesAndcopyNewFiles = async () => {
    try {
        await deleteOldFiles(destDir);

        ncp(srcDir, destDir, ncpoptions, function (err) {
            if (err) {
                return console.error(err);
            }
            else{
                console.log(`directory ncp copy done for ${srcDir} to ${destDir}`);
            }
        });
    }
    catch (err) {
        console.error('Error during initial setup: ' + err);
    }
};

const deleteOldFiles = async (dirForDeletingFiles) => {
    console.log('Deleting old files in ' + dirForDeletingFiles);
    //check that the directory exists
    if (!fs.existsSync(dirForDeletingFiles)) {
        console.log('Directory does not exist, nothing to delete.');
        return;
    }
    fs.rmSync(dirForDeletingFiles, { recursive: true })
};

deleteOldFilesAndcopyNewFiles();