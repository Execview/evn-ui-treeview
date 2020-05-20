import { question } from 'readline-sync'
import config from '../config.json'
import { getModulePath, isAModule, moduleContainsPackageInDependencies, executeSequentially } from './transpileModule.js'

const commandsToExecute = []

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
const modulesToCascade = Object.keys(config).slice(startingIndex)

modulesToCascade.forEach(n=>{
	const moduleDependencies = Object.keys(config).filter(ourDependency=>moduleContainsPackageInDependencies(n,ourDependency))

	if(moduleDependencies.length > 0){
		commandsToExecute.push({for: n, path: getModulePath(n), command: `npm install --save-exact ${moduleDependencies.map(d=>d+`@latest`).join(' ')}`})
	}

	if(isAModule(n)){
		commandsToExecute.push({for: n, path: getModulePath(n), command: `npm publish`})
	}
})

executeSequentially(commandsToExecute)