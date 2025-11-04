#!/bin/bash
executionScriptDir=$(pwd)

echo "Howdy, let's deploy this thing!"

if [ "$1" == "-h" ]; then
  echo "Deployment script"
  echo "Flags:"
  echo "    -m minor version npm patch (by default normal patch)"
  exit 0
fi

#get all CLI args
flagsProcessed=0
isMinorPatch=false
for var in "$@"
do
  if [[ "$var" = "-m" ]]; then
    isMinorPatch=true
  fi
  flagsProcessed=$((flagsProcessed+1))
done

if [ "$isMinorPatch" = true ] ; then
  npm version minor
else
  npm version patch
fi
exit 0
npm run build
npm run copyBuildToFirebase

cd ./firebaseski
firebase deploy

cd $executionScriptDir

echo "commiting firebase cache files."
git add ./firebaseski/.firebase/hosting.cHVibGlj.cache
git commit -m "firebase cache for release."

git push --tags origin master