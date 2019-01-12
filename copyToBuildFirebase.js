//copy files from build dir to firebase
const path = require('path');

//copy build files to firebase directory
var ncp = require('ncp').ncp;
let srcDir = path.join(__dirname, "build");

let destDir = path.join(__dirname, "firebaseski/public");

console.log('source directory: ', srcDir);
console.log('destination directory: ', destDir);

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
