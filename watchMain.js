import chokidar from 'chokidar'
import config from './config.json'
import transpileModule, { isAModule, getModulePath } from './transpileModule.js'

const toWatch = Object.keys(config).filter((n)=>isAModule(n))

toWatch.forEach((n)=>{
	const srcPath = getModulePath(n)+'/src'
	let scanned = false	
	const onAnyChange = (event,path) => {
		scanned && console.log(event, path);
		switch(event){
			case 'change': {
				transpileModule(n)
				break;
			}
			case 'add': {
				scanned && transpileModule(n)
				break;
			}
			case 'ready' : {
				scanned=true
				transpileModule(n)
				.catch(err=>console.log(err))
				.then(res=>console.log("watching "+n+" in "+srcPath))
			}
			default: break;
		}
	}
	
	chokidar.watch(srcPath,{persistent:true, followSymlinks: true}).on('all',onAnyChange).on('ready',()=>onAnyChange('ready',srcPath));
})