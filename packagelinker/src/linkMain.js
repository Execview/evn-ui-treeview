import config from '../config.json'
import path from 'path'

import transpileModule, { getTranspiledModulePath, getModulePath, isAModule, execute, moduleContainsPackageInDependencies } from './transpileModule.js'

let linkModuleWithPackage = Object.fromEntries(Object.keys(config).map(k=>[k,[]]))

Object.keys(linkModuleWithPackage).forEach(n=>{
	transpileModule(n)
	const ourDependencies = Object.keys(config).filter((p)=>moduleContainsPackageInDependencies(n,p))
	ourDependencies.forEach(mod=>{
		if(!linkModuleWithPackage[n]){linkModuleWithPackage[n]=[]}
		linkModuleWithPackage[n].push(mod)
	})
})

console.log(linkModuleWithPackage)


const unlinkMode = (process.argv[2] && process.argv[2]==='unlink')

const sharedPackages = [
	'react',
	'redux',
	'react-redux'
]

let modLinkCommands = []
let dependantInstallCommands = []
let mainSharedNpmLinkCommands = {}
let mainSharedNpmLinkInstallCommands = []
let reinstallCommands = []

let lastModule = ""
Object.entries(linkModuleWithPackage).forEach(([mod,dependants])=>{
	// For hooks to work, there must only be one React! This is the workaround suggested by: https://reactjs.org/warnings/invalid-hook-call-warning.html#duplicate-react . This will hopefully overwrite the react symlink with each subsequent module's.

	sharedPackages.forEach(name=>{
		if(lastModule && moduleContainsPackageInDependencies(lastModule,name)){
			//npm link the previous module's version of react
			const lastModulePath = getModulePath(lastModule)
			const lastModuleCommand = unlinkMode ? `npm unlink ${name}` : `npm link ${name}`
			mainSharedNpmLinkInstallCommands.push([lastModuleCommand,lastModulePath])
		}

		if(moduleContainsPackageInDependencies(mod,name)){
			const sharedPath = path.resolve(getModulePath(mod),`./node_modules/${name}`)
			const sharedInstallCommand = unlinkMode ? `npm unlink` : `npm link`
			mainSharedNpmLinkCommands[name] = [sharedInstallCommand,sharedPath]
		}
	})
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
console.log(mainSharedNpmLinkCommands)
console.log(dependantInstallCommands)
console.log(mainSharedNpmLinkInstallCommands)
unlinkMode && console.log(reinstallCommands)

console.log('transpiling modules...')
Promise.all(Object.keys(config).map(n=>transpileModule(n)))
.then(()=>console.log('creating module npm links...'))
.then(()=>Promise.all(modLinkCommands.map(mlc=>execute(mlc[0],{cwd: mlc[1]}))))
.then(()=>console.log('creating react npm link...'))
.then(()=>Promise.all(Object.entries(mainSharedNpmLinkCommands).map(([name,msnlc])=>execute(msnlc[0],{cwd: msnlc[1]}))))
.then(()=>console.log('installing the module npm links...'))
.then(()=>Promise.all(dependantInstallCommands.map(dic=>execute(dic[0],{cwd: dic[1]}))))
.then(()=>console.log('installing the module react links...'))
.then(()=>Promise.all(mainSharedNpmLinkInstallCommands.map(rdc=>execute(rdc[0],{cwd: rdc[1]}))))
.then(()=>console.log(unlinkMode?'reinstalling original packages...':''))
.then(()=>Promise.all(reinstallCommands.map(rc=>execute(rc[0],{cwd: rc[1]}))))
.then(()=>console.log('success!'))








