import {exec} from 'child_process'
import path from 'path'
import config from '../config.json'
import * as fs from 'fs'

export const getFullPath = p => path.resolve(process.cwd(),p)

export const getModulePath = (n) => getFullPath(config[n])
export const getTranspiledModulePath = (n) => getModulePath(n)

export const isAModule = (n) => n.includes('@')

const transpileModule = (n) => {
	if(!isAModule(n)){return}
	const transpileCommand = `babel "${path.resolve(getModulePath(n),'./src')}" -d "${path.resolve(getTranspiledModulePath(n),'./transpiled')}" --copy-files --plugins=@babel/plugin-proposal-class-properties --presets=@babel/preset-env,@babel/preset-react`
	console.log(`transpiling ${n}`)
	return (
		execute(transpileCommand)
	)
}

export const execute = (command,options) => new Promise((resolve,reject)=>{
	const defaultCommand = 'cd' 
	exec(command || defaultCommand,options,(err,stdout,stderr)=>stdout ? resolve(stdout) : reject(err||stderr))
})


export const moduleContainsPackageInDependencies = (n,p) => {
	const packageJsonFile = fs.readFileSync(path.resolve(getModulePath(n),'./package.json'));
	if(!packageJsonFile || !packageJsonFile[0]==='{'){return}
	const packageJson = JSON.parse(packageJsonFile)
	const depProperties = Object.keys(packageJson).filter(k=>k.includes('dep')) //peerDeps, devDeps, deps, etc...	
	return depProperties.some(dep=>{
		return Object.keys(packageJson[dep]).includes(p)
	})
}


export default transpileModule