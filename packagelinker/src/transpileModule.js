import {exec} from 'child_process'
import path from 'path'
import config from '../config.json'

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

export default transpileModule