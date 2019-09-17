const removeOurOptions = (options) => {
	const {body,debug,payload,token,holder,method,timeout,...otherOptions} = options
	return otherOptions
}

const fetchy = (link,options={})=>{
	const debug = options.debug || false
	const payload = options.body
	const token = options.token
	const holder = options.holder || ''
	const timeout = options.timeout || 3000
	const otherOptions = removeOurOptions(options)
	

	if(!link){console.log('WHERE IS THE LINK?!'); return}

	let body = undefined;
	if(payload!==undefined){
		if(holder){
			body = {
				payload: payload || {},
				meta: {holder: holder}
			}
		} else {
			body = payload || {}
		}
	}
	const hasBody = (body!==undefined)
	let method = options.method || (hasBody ? 'POST': 'GET')

	let headers = {}
	if(method!=='GET'){headers["Content-Type"] = "application/json"}
	

	let controller = new AbortController();
	let fetchOptions = {
		signal: controller.signal,
		method:method,
		headers: headers,
		...otherOptions
	}
	if(hasBody){
		isTextFormat = ['json','text'].includes(fetchOptions.headers["Content-Type"] || '') 
		fetchOptions.body = isTextFormat ? JSON.stringify(body) : body
	}
	
	if(token){fetchOptions.headers["Authorization"] = "Bearer "+token}

	const debugInfo = {url: link,fetchOptions: {...fetchOptions, body:body}}
	debug && console.log(debugInfo)
	return Promise.race([
		fetch(link, fetchOptions),
		new Promise((resolve, reject) => setTimeout(() => {reject('too slow! -> '+link); controller.abort()}, timeout))
	])
}

export default fetchy