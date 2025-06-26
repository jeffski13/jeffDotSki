const path = require('path');
const ncp = require('ncp').ncp;

let srcDir = path.join(__dirname, "build");

let destDir = path.join(__dirname, "firebaseski/public");

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
