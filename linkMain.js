import config from './config.json'

import * as fs from 'fs'
import transpileModule, { getTranspiledModulePath, synchronousCommandExecuter, getModulePath, isAModule, execute } from './transpileModule.js'

let linkModuleWithPackage = Object.fromEntries(Object.keys(config).map(k=>[k,[]]))

console.log(linkModuleWithPackage)

Object.keys(linkModuleWithPackage).forEach(n=>{
	transpileModule(n)
	const packageJsonFile = fs.readFileSync(getModulePath(n)+'\\package.json');
	if(!packageJsonFile || !packageJsonFile[0]==='{'){return}
	const packageJson = JSON.parse(packageJsonFile)
	const depProperties = Object.keys(packageJson).filter(k=>k.includes('dep')) //peerDeps, devDeps, deps, etc...
	depProperties.forEach(dep=>{
		Object.keys(packageJson[dep]).filter(moduleName=>Object.keys(config).includes(moduleName)).forEach(mod=>{
			if(!linkModuleWithPackage[n]){linkModuleWithPackage[n]=[]}
			linkModuleWithPackage[n].push(mod)
		})
	})
})

console.log(linkModuleWithPackage)


const unlinkMode = (process.argv[2] && process.argv[2]==='unlink')

let modLinkCommands = []
let dependantInstallCommands = []
let reinstallCommands = []

Object.entries(linkModuleWithPackage).forEach(([mod,dependants])=>{
	
	if(isAModule(mod)){
		const modPath = getTranspiledModulePath(mod)
		const modCommand = unlinkMode ? `npm unlink` : `npm link`
		modLinkCommands.push([modCommand,modPath])
	}

	const dependantPath = getModulePath(mod)
	dependants.forEach(d=>{		
		const dependantCommand = unlinkMode ? `npm unlink --no-save ${d}` : `npm link ${d}`
		dependantInstallCommands.push([dependantCommand,dependantPath])
	})

	unlinkMode && reinstallCommands.push([`npm install`,dependantPath])
})

console.log(modLinkCommands)
console.log(dependantInstallCommands)

Promise.all(Object.keys(config).map(n=>transpileModule(n)))
.then(()=>Promise.all(modLinkCommands.map(mlc=>execute(mlc[0],{cwd: mlc[1]}))))
.then(()=>Promise.all(dependantInstallCommands.map(dic=>execute(dic[0],{cwd: dic[1]}))))
.then(()=>Promise.all(reinstallCommands.map(rc=>execute(rc[0],{cwd: rc[1]}))))
.then(()=>console.log('success!'))








