import {exec} from 'child_process'
import path from 'path'
import config from './config.json'

export const getFullPath = p => path.resolve(process.cwd(),p)

export const getModulePath = (n) => getFullPath(config[n])
export const getTranspiledModulePath = (n) => getFullPath("./packages/"+n.split('/')[1] || "./packages/"+n) 

export const isAModule = (n) => n.includes('@')

const transpileModule = (n) => {
	if(!isAModule(n)){return}
	const copyCommand = `${process.platform === 'win32'?'copy':'cp'} "${getModulePath(n)}\\package.json" "${getTranspiledModulePath(n)}\\package.json"`
	const transpileCommand = `babel "${getModulePath(n)}\\src" -d "${getTranspiledModulePath(n)}\\transpiled" --copy-files --plugins=@babel/plugin-proposal-class-properties --presets=@babel/preset-env,@babel/preset-react`
	console.log(`transpiling ${n}`)
	//console.log(`${copyCommand} && ${transpileCommand}`)
	return (
		execute(transpileCommand)
		.then(()=>execute(copyCommand))
	)
}

export const synchronousCommandExecuter = (commandArray) => new Promise((resolve,reject)=>{
	if(!commandArray || commandArray.length===0){return resolve('done')}
	const [currentCommand, ...restOfTheCommands] = commandArray
	resolve(
		execute(currentCommand[0],{cwd: currentCommand[1]})
		.catch(err=>console.log(err))
		.then(res=>{
			console.log(res)
			return synchronousCommandExecuter(restOfTheCommands)
		})
	)
})

export const execute = (command,options) => new Promise((resolve,reject)=>{
	const defaultCommand = 'cd' 
	exec(command || defaultCommand,options,(err,stdout,stderr)=>stdout ? resolve(stdout) : reject(err||stderr))
})

export default transpileModule