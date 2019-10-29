import config from '../config.json'
import path from 'path'
import * as fs from 'fs'
import transpileModule, { getTranspiledModulePath, getModulePath, isAModule, execute } from './transpileModule.js'

let linkModuleWithPackage = Object.fromEntries(Object.keys(config).map(k=>[k,[]]))

console.log(linkModuleWithPackage)

Object.keys(linkModuleWithPackage).forEach(n=>{
	transpileModule(n)
	const packageJsonFile = fs.readFileSync(path.resolve(getModulePath(n),'./package.json'));
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
let mainReactInstallCommand = ''
let reactDuplicateCommands = []
let reinstallCommands = []

let lastModule = ""
Object.entries(linkModuleWithPackage).forEach(([mod,dependants])=>{
	// For hooks to work, there must only be one React! This is the workaround suggested by: https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react . This will hopefully overwrite the react symlink with each subsequent module's.

	if(lastModule){
		//npm link the previous module's version of react
		const lastModulePath = getModulePath(lastModule)
		const lastModuleCommand = unlinkMode ? `npm unlink react` : `npm link react`
		reactDuplicateCommands.push([lastModuleCommand,lastModulePath])
	}

	const reactPath = path.resolve(getModulePath(mod),'./node_modules/react')
	const reactCommand = unlinkMode ? `npm unlink` : `npm link`
	mainReactInstallCommand = [reactCommand,reactPath]
	lastModule = mod
	
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
console.log(mainReactInstallCommand)
console.log(dependantInstallCommands)
console.log(reactDuplicateCommands)
unlinkMode && console.log(reinstallCommands)

console.log('transpiling modules...')
Promise.all(Object.keys(config).map(n=>transpileModule(n)))
.then(()=>console.log('creating module npm links...'))
.then(()=>Promise.all(modLinkCommands.map(mlc=>execute(mlc[0],{cwd: mlc[1]}))))
.then(()=>console.log('creating react npm link...'))
.then(()=>execute(mainReactInstallCommand[0],{cwd: mainReactInstallCommand[1]}))
.then(()=>console.log('installing the module npm links...'))
.then(()=>Promise.all(dependantInstallCommands.map(dic=>execute(dic[0],{cwd: dic[1]}))))
.then(()=>console.log('installing the module react links...'))
.then(()=>Promise.all(reactDuplicateCommands.map(rdc=>execute(rdc[0],{cwd: rdc[1]}))))
.then(()=>console.log(unlinkMode?'reinstalling original packages...':''))
.then(()=>Promise.all(reinstallCommands.map(rc=>execute(rc[0],{cwd: rc[1]}))))
.then(()=>console.log('success!'))








