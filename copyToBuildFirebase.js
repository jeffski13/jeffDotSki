/*
 *copy files from build dir to firebase for a production deploy
 */
const path = require('path');

//copy build files to firebase directory
var ncp = require('ncp').ncp;
let srcDir = path.join(__dirname, "build");

let destDir = path.join(__dirname, "firebaseski/public");

//we are ok with overwriting old files
var ncpoptions = {
    "clobber": true
}

ncp(srcDir, destDir, ncpoptions, function (err) {
    if (err) {
        return console.error(err);
    }
    else{
        console.log('directory ncp copy done!');
    }
});
