executionScriptDir=$(pwd)

echo "howdy y'all, lets deploy this thang"

npm version patch
npm run build
npm run copyBuildToFirebase

cd ./firebaseski
firebase deploy

cd $executionScriptDir

echo "commiting firebase cache files."
git add ./firebaseski/.firebase/hosting.cHVibGlj.cache
git commit -m "firebase cache for release."

git push --tags origin master