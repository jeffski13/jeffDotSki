#!/bin/bash
executionScriptDir=$(pwd)

echo "Howdy, let's deploy this thing!"

if [ "$1" == "-h" ]; then
  echo "Deployment script"
  echo "Flags:"
  echo "    -m minor version npm patch (by default normal patch)"
  echo "    -dnv do not version (skips npm version bump)"
  exit 0
fi

#get all CLI args
flagsProcessed=0
isMinorPatch=false
doNotVersion=false
for var in "$@"
do
  if [[ "$var" = "-m" ]]; then
    isMinorPatch=true
  fi
  if [[ "$var" = "-dnv" ]]; then
    doNotVersion=true
  fi
  flagsProcessed=$((flagsProcessed+1))
done

if [ "$doNotVersion" = true ] ; then
  echo "Skipping versioning (-dnv passed)."
elif [ "$isMinorPatch" = true ] ; then
  npm version minor
else
  npm version patch
fi

npm run build
npm run copyBuildToFirebase

if [ ! -d "./firebaseski/public" ] || [ -z "$(ls -A ./firebaseski/public)" ]; then
  echo "Error: firebaseski/public does not exist or is empty. Aborting deploy."
  exit 1
fi

cd ./firebaseski
firebase deploy

cd $executionScriptDir

echo "commiting firebase cache files."
npmVersion=$(node -p "require('./package.json').version")
git add ./firebaseski/.firebase/hosting.cHVibGlj.cache
git commit -m "firebase cache for release. v$npmVersion"

git push --tags origin master