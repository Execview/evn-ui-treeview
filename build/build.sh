NAME="evn-ui-lib"
GIT_HASH=$(git log -1 --format="%H")
VER=`date +%y.%m.%d.%H%m%S`

npm set registry https://registry.npmjs.org/
npm install -g npm-cli-login
npm set registry https://npm.evlem.net
NPM_REGISTRY=https://npm.evlem.net NPM_USER=jenkins NPM_PASS=$1 NPM_EMAIL=$2 npm-cli-login

./../menu/npm publish
./../table/npm publish
./../treeview/npm publish
./../scheduler/npm publish

npm set registry https://registry.npmjs.org/