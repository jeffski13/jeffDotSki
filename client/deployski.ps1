Write-Host "howdy y'all, lets deploy this ish"

npm run build; npm run deploy

cd $HOME/Documents/Firebase/jeffdotski
firebase deploy

cd $PSScriptRoot