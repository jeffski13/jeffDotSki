
#!/bin/bash
executionScriptDir=$(pwd)

git checkout master && git pull

./deployski.sh

cd $executionScriptDir