executionScriptDir=$(dirname "$0")

echo "howdy y'all, lets deploy this ish"

npm version patch && npm run build && npm run deploy

cd ./firebaseski
firebase deploy

cd $executionScriptDir