NAME="evn-ui-lib"
GIT_HASH=$(git log -1 --format="%H")
VER=`date +%y.%m.%d.%H%m%S`

../menu/npm publish
../table/npm publish
../treeview/npm publish
../scheduler/npm publish