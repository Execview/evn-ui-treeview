import chokidar from 'chokidar'
import { Observable } from 'rxjs'
import config from '../config.json'
import transpileModule, { isAModule, getModuleSrc, copyTranspiledFolderIntoNodeModules, forceDependantsToRefresh } from './transpileModule.js'

const toWatch = Object.keys(config).filter((n)=>isAModule(n))

const transpileModuleThenCopyIntoNodeModulesAndLog = (n) => {
	return (
		transpileModule(n)
		.then(()=>copyTranspiledFolderIntoNodeModules(n))
		.then(()=>forceDependantsToRefresh(n))
		.catch(err=>console.log(err))
	)
}

const reloadPackageObservable = new Observable(subscriber => {
	toWatch.forEach((n)=>{
		const srcPath = getModuleSrc(n)
		let scanned = false	
		const onAnyChange = (event,path) => {
			//scanned && console.log(`[${n}]: ${event}`);
			switch(event){
				case 'change': {
					subscriber.next(n)
					break;
				}
				case 'add': {
					scanned && subscriber.next(n)
					break;
				}
				case 'ready' : {
					scanned=true
					console.log("watching "+n+" in "+srcPath)
					subscriber.next(n)
				}
				default: break;
			}
		}
		
		chokidar.watch(srcPath,{persistent:true, followSymlinks: true}).on('all',onAnyChange).on('ready',()=>onAnyChange('ready',srcPath));
	})
})

const controlledSubscribeSet = (s, callback, options={}) => { //only sends next event when the previous finishes (callback promise is resolved). sends duplicates to the back of the processing queue

	const debug = options.debug

	const callbackPromise = callback.catch ? callback : (...args)=>Promise.resolve(callback(...args))

	let buffer = s.__buffer = []
	let thinking = false

	const consumeNext = () => {
		debug && console.log('to do:', buffer)
		if(buffer.length>0){
			thinking = true
			const processData = buffer.shift()
			console.log('processing:', processData, '\n')
			callbackPromise(processData).then(()=>{
				consumeNext()
			})
		} else {
			thinking = false
		}
	}

	s.subscribe(e=>{
		// buffer = buffer.filter(el=>el!==e) //place e at the end,
		// buffer.push(e)
		!buffer.includes(e) && buffer.push(e) //no point moving it to the end if it was going to get processed next anyway...
		if(!thinking){
			consumeNext()
		}
	})	
}

controlledSubscribeSet(reloadPackageObservable, (refresh) => transpileModuleThenCopyIntoNodeModulesAndLog(refresh),{debug: true})
