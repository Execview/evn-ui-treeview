import chokidar from 'chokidar'
import path from 'path'
import config from '../config.json'
import transpileModule, { isAModule, getModulePath } from './transpileModule.js'

const toWatch = Object.keys(config).filter((n)=>isAModule(n))

const transpileModuleAndLog = (n) => transpileModule(n).then(res=>{console.log('done'); return res})

toWatch.forEach((n)=>{
	const srcPath = path.resolve(getModulePath(n),'./src')
	let scanned = false	
	const onAnyChange = (event,path) => {
		scanned && console.log(event, path);
		switch(event){
			case 'change': {
				transpileModuleAndLog(n)
				break;
			}
			case 'add': {
				scanned && transpileModuleAndLog(n)
				break;
			}
			case 'ready' : {
				scanned=true
				transpileModuleAndLog(n)
				.catch(err=>console.log(err))
				.then(res=>console.log("watching "+n+" in "+srcPath))
			}
			default: break;
		}
	}
	
	chokidar.watch(srcPath,{persistent:true, followSymlinks: true}).on('all',onAnyChange).on('ready',()=>onAnyChange('ready',srcPath));
})