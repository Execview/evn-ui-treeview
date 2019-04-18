NAME="evn-ui-lib"
GIT_HASH=$(git log -1 --format="%H")
VER=`date +%y.%m.%d.%H%m%S`

cd menu && npm publish --access restricted
cd ../table && npm publish --access restricted
cd ../treeview && npm publish --access restricted
cd ../scheduler && npm publish --access restricted