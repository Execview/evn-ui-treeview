import {exec} from 'child_process'
import path from 'path'
import config from '../config.json'
import * as fs from 'fs'
import moment from 'moment';

export const getFullPath = p => path.resolve(process.cwd(),p)

export const getModulePath = (n) => getFullPath(config[n])
export const getModuleSrc = (n) => path.resolve(getModulePath(n),'./src')
export const getModulePackageJson = (n) => fs.readFileSync(path.resolve(getModulePath(n),'./package.json'))

export const getTranspiledModulePath = (n) => path.resolve(getFullPath('.'),'./transpiled/'+n)

export const isAModule = (n) => n.includes('@')

const transpileModule = (n) => {
	if(!isAModule(n)){return}
	const transpileCommand = `babel "${getModuleSrc(n)}" -d "${getTranspiledModulePath(n)}" --copy-files --plugins=@babel/plugin-proposal-class-properties --presets=@babel/preset-env,@babel/preset-react`
	return (
		execute(transpileCommand)
	)
}

export const copyTranspiledFolderIntoNodeModules = (n) => {
	const copyCommands = []
	const modulesThatRequireN = Object.keys(config).filter(k=>moduleContainsPackageInDependencies(k,n))
	modulesThatRequireN.forEach(k=>{
		//copy transpiled n into k
		const copy = process.platform === "win32"?'robocopy /E':'cp'
		const copyCommand = `${copy} "${getTranspiledModulePath(n)}" "${path.resolve(getModulePath(k),`./node_modules/${n}/transpiled`)}"`
		copyCommands.push(copyCommand)
	})

	return Promise.all(copyCommands.map(cc=>execute(cc))).then(()=>console.log(`[${n}]: Transpiled & copied!`))
}

export const forceDependantsToRefresh = (n) => {
	const modulesThatRequireN = Object.keys(config).filter(k=>moduleContainsPackageInDependencies(k,n))
	modulesThatRequireN.forEach(k=>{
		//append something to a file for each k
		const fileToAlter = path.resolve(getModuleSrc(k),'./version.js') //
		const datePart = `${moment(new Date()).format('YYYY-MM-DD [at] HH:mma ss.S[s]')}`
		const newText = `export default {version: '#${datePart}#'};`
		console.log(newText)
		fs.writeFileSync(fileToAlter, newText)
	})
}

export const execute = (command,options) => new Promise((resolve,reject)=>{
	const defaultCommand = 'cd' 
	exec(command || defaultCommand,options,(err,stdout,stderr)=>stdout ? resolve(stdout) : reject(err||stderr))
})


export const moduleContainsPackageInDependencies = (n,p) => {
	const packageJsonFile = getModulePackageJson(n);
	if(!packageJsonFile || !packageJsonFile[0]==='{'){return}
	const packageJson = JSON.parse(packageJsonFile)
	const depProperties = Object.keys(packageJson).filter(k=>k.includes('dep')) //peerDeps, devDeps, deps, etc...	
	return depProperties.some(dep=>{
		return Object.keys(packageJson[dep]).includes(p)
	})
}


export default transpileModule