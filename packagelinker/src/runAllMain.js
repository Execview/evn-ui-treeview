import config from '../config.json'
import { execute, getModulePath } from './transpileModule.js'

const command = process.argv.slice(2).join(' ')

console.log(command)

Object.keys(config).forEach((n)=>{
	const commandPath = getModulePath(n)
	console.log(`executing ${command} in ${commandPath}`)
	execute(command, {cwd: commandPath})
	.catch(err=>console.log(err))
	.then(res=>console.log(res))
})