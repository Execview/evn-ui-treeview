NAME="evn-ui-lib"
GIT_HASH=$(git log -1 --format="%H")
VER=`date +%y.%m.%d.%H%m%S`

cd menu && npm publish
cd ../table && npm publish
cd ../treeview && npm publish
cd ../scheduler && npm publish