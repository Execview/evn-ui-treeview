import chokidar from 'chokidar'
import path from 'path'
import config from '../config.json'
import transpileModule, { isAModule, getModuleSrc, copyTranspiledFolderIntoNodeModules, forceDependantsToRefresh } from './transpileModule.js'

const toWatch = Object.keys(config).filter((n)=>isAModule(n))

const transpileModuleThenCopyIntoNodeModulesAndLog = (n) => {
	return (
		transpileModule(n)
		.then(()=>copyTranspiledFolderIntoNodeModules(n))
		.then(()=>forceDependantsToRefresh(n))
	)
}

toWatch.forEach((n)=>{
	const srcPath = getModuleSrc(n)
	let scanned = false	
	const onAnyChange = (event,path) => {
		scanned && console.log(`[${n}]: ${event}`);
		switch(event){
			case 'change': {
				transpileModuleThenCopyIntoNodeModulesAndLog(n)
				break;
			}
			case 'add': {
				scanned && transpileModuleThenCopyIntoNodeModulesAndLog(n)
				break;
			}
			case 'ready' : {
				scanned=true
				transpileModuleThenCopyIntoNodeModulesAndLog(n)
				.catch(err=>console.log(err))
				.then(res=>console.log("watching "+n+" in "+srcPath))
			}
			default: break;
		}
	}
	
	chokidar.watch(srcPath,{persistent:true, followSymlinks: true}).on('all',onAnyChange).on('ready',()=>onAnyChange('ready',srcPath));
})