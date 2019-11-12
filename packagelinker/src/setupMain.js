import config from '../config.json'
import {execute, moduleContainsPackageInDependencies, getModulePath} from './transpileModule'
import path from 'path'
import * as fs from 'fs'

const stopIgnoringNodeModulesIn = (m) => {
	const reactScriptsConfigPath = path.resolve(getModulePath(m),`./node_modules/react-scripts/config/webpackDevServer.config.js`)
	const reactScriptsConfig = fs.readFileSync(reactScriptsConfigPath,'utf8')
	const ignorePathString = "ignored: ignoredFiles(paths.appSrc),"
	const newText = reactScriptsConfig.replace(ignorePathString,'')
	fs.writeFileSync(reactScriptsConfigPath, newText)
}

Object.keys(config).forEach(k=>{
	if(moduleContainsPackageInDependencies(k,'react-scripts')){
		stopIgnoringNodeModulesIn(k)
	}
})

