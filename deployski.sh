executionScriptDir=$(dirname "$0")

echo "howdy y'all, lets deploy this ish"

npm version patch
npm run build
npm run copyBuildToFirebase

cd ./firebaseski
firebase deploy

cd $executionScriptDir

git add ./firebaseski/.firebase/hosting.cHVibGlj.cache
git commit -m "firebase cache for release."