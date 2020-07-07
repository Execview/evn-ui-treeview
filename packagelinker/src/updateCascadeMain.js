import { question } from 'readline-sync'
import config from '../config.json'
import { getModulePath, isAModule, moduleContainsPackageInDependencies, doSequentially, execute, getModulePackageJson, writeToModulePackageJson } from './transpileModule.js'

const startingModule = process.argv[2]

if(!startingModule){
	const response = question('This will publish and install ALL of our modules. Dont do this! ...are you sure? (Y/N)')
	if(response.toLowerCase()!=='y'){
		process.exit()
	}
}

const startingIndex = Object.keys(config).indexOf(process.argv[2])
if(startingIndex===-1){
	console.log('Cant find the specified module...')
	process.exit()
}
const packagesToCacade = Object.keys(config).slice(startingIndex)


const cachedVersions = {}
const publishModule = (m) => {console.log(`[${m}]: Publishing...`); cachedVersions[m] = null ; return execute(`npm publish`,{cwd: getModulePath(m)})}
const getModuleVersion = (m) => cachedVersions[m] ? Promise.resolve(cachedVersions[m]) : execute(`npm show ${m} version`).then(res=>{const v = res.trim(); cachedVersions[m]=v; return v})

const updatePackageVersion = (p,m,v,options) => {
	const {type} = options || {}
	const letter = type !== 'exact' ? '^' : ''
	console.log(`[${p}]: Updating ${m} to ${letter}${v}`)
	const pj = getModulePackageJson(p)
	let newPj = pj
	const depProperties = Object.keys(pj).filter(k=>k.includes('dep'))
	depProperties.forEach(dp=>{
		if(pj[dp][m]){
			newPj[dp][m]=`${letter}${v}`
		} 
	})
	return writeToModulePackageJson(p,newPj)
}

let promiseFunctions = []
packagesToCacade.forEach(p=>{
	const moduleDependencies = Object.keys(config).filter(m=>moduleContainsPackageInDependencies(p,m))

	if(moduleDependencies.length > 0){
		moduleDependencies.forEach(m=>{
			promiseFunctions.push(() => getModuleVersion(m).then(v=>updatePackageVersion(p,m,v,{type: 'exact', speed: 'quick'})))
		});
	}

	if(isAModule(p)){
		promiseFunctions.push(()=>publishModule(p))
	}
})

doSequentially(promiseFunctions)