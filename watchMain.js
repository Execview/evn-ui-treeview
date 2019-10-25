import {exec,spawn} from 'child_process'
import chokidar from 'chokidar'
import config from './config.json'


const toWatch = Object.fromEntries(Object.entries(config).filter(([n,l])=>n.includes('@')))


Object.entries(toWatch).forEach(([n,l])=>{
	const srcPath = l+"/src"
	const transpiledPath = l+"/transpiled"
	const transpileCommand = `babel ${srcPath} -d ${transpiledPath} --copy-files --plugins=@babel/plugin-proposal-class-properties --presets=@babel/preset-env,@babel/preset-react`

	let scanned = false
	console.log("watching "+n+" in "+l)
	chokidar.watch(srcPath,{persistent:true}).on('all', (event, path) => {
		console.log(event, path);
		switch(event){
			case 'change': {
				console.log(`transpiling ${n}`)
				console.log(transpileCommand)
				exec(transpileCommand)
				console.log('done!')
				break;
			}
			case 'add': {
				break;
			}
			case 'ready' : {
				console.log('rdy!')
				scanned=true
			}
			default: break;
		}
		if(event==='change'){
			
		}
	});

	// exec(command)
})