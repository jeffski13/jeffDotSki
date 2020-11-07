#create prod build files
#Step 1) create new tag/version
#Step 2) build react bundle
#Step 3) move bundle files into firebase 
#Step 4) deploy to firebase!
#Step 5) push to git with updated tags (so we have a record of our deployed website versioned)
Write-Host "howdy y'all, lets deploy this ish"

npm version patch; npm run build; npm run deploy

#deploy build files to prod
#NOTE: must globally install firebase (npm install -g firebse)
cd ./firebaseski
firebase deploy

cd $PSScriptRoot

git push --tags