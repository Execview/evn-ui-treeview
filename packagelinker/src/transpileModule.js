import {exec} from 'child_process'
import path from 'path'
import config from '../config.json'
import * as fs from 'fs'
import moment from 'moment';

export const getFullPath = p => path.resolve(process.cwd(),p)

export const getModulePath = (n) => getFullPath(config[n])
export const getModuleSrc = (n) => path.resolve(getModulePath(n),'./src')
export const extractJSON = (fb) => {
	const f = fb.toString()
	if(!fb || !f || f[0]!=='{'){
		return {}
	} else {
		return JSON.parse(f)
	}
}
export const getModulePackageJson = (n) => extractJSON(fs.readFileSync(path.resolve(getModulePath(n),'./package.json')))
export const getModulePackageLock = (n) => extractJSON(fs.readFileSync(path.resolve(getModulePath(n),'./package-lock.json')))
export const writeToModulePackageJson = (n,data) => fs.writeFileSync(path.resolve(getModulePath(n),'./package.json'),JSON.stringify(data,null,"\t")) 

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
	const modulesThatRequireN = Object.keys(config).filter(k=>moduleContainsPackageInINDIRECTDependencies(k,n))
	modulesThatRequireN.forEach(k=>{
		//copy transpiled n into k
		const isWindows = process.platform === "win32"
		const copy = isWindows ? 'robocopy /E' : 'cp'
		const copyCommand = `${copy} "${getTranspiledModulePath(n)}" "${path.resolve(getModulePath(k),`./node_modules/${n}/transpiled`)}"`
		
		copyCommands.push(copyCommand)
	})

	return Promise.all(copyCommands.map(cc=>execute(cc)))//.then(()=>console.log(`[${n}]: Transpiled & copied!`))
}

export const forceDependantsToRefresh = (n) => {
	const modulesThatRequireN = Object.keys(config).filter(k=>moduleContainsPackageInINDIRECTDependencies(k,n))
	modulesThatRequireN.forEach(k=>{
		//append something to a file for each k
		const fileToAlter = path.resolve(getModuleSrc(k),'./version.js') //
		const datePart = `${moment(new Date()).format('YYYY-MM-DD [at] HH:mma ss.S[s]')}`
		const newText = `export default {version: '#${datePart}#'};`
		try {
			fs.writeFileSync(fileToAlter, newText)
		}
		catch (e) {
			console.error(`failed to refresh ${k}`)
		}
		
	})
}

export const execute = (command,options) => new Promise((resolve,reject)=>{
	const defaultCommand = 'cd' 
	exec(command || defaultCommand,options,(err,stdout,stderr)=>stdout ? resolve(stdout) : reject(err||stderr))
})

export const doSequentially = (promiseFunctions) => promiseFunctions.reduce((lastPromise, pf)=>(
	lastPromise
	.then(()=>pf())
	.catch(err=>console.error(err))
	)
,Promise.resolve())


export const moduleContainsPackageInINDIRECTDependencies = (n,p) => {
	const packageLock = getModulePackageLock(n);
	let flatRequirementList = []
	const appendRequirements = (tree) => {
		if(!typeof(tree)==='object'){return}
		Object.entries(tree).forEach(([k,t])=>{
			if(!flatRequirementList.includes(k)) { flatRequirementList.push(k) }
			if(t.dependencies) { appendRequirements(t.dependencies) }
		})
	}
	appendRequirements(packageLock.dependencies)
	return flatRequirementList.includes(p)
}

export const moduleContainsPackageInDependencies = (n,p) => {
	const packageJson = getModulePackageJson(n)
	const depProperties = Object.keys(packageJson).filter(k=>k.includes('dep')) //peerDeps, devDeps, deps, etc...	
	return depProperties.some(dep=>{
		return Object.keys(packageJson[dep]).includes(p)
	})
}


export default transpileModule