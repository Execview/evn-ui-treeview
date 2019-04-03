NAME="evn-ui-lib"
GIT_HASH=$(git log -1 --format="%H")
VER=`date +%y.%m.%d.%H%m%S`

../npm set registry https://npm.evlem.net

npm install -g npm-cli-login

npm-cli-login -u jenkins -p $1 -e 'andras.ludanyi@execview.com'

../menu/npm publish
../table/npm publish
../treeview/npm publish
../scheduler/npm publish