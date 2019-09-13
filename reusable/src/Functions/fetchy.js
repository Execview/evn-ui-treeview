const removeOurOptions = (options) => {
	const {debug,payload,token,holder,method,timeout,...otherOptions} = options
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
	if(token){headers["Authorization"] = "Bearer "+token}

	let fetchOptions = {
		method:method,
		headers: headers,
		...otherOptions
	}
	if(hasBody){fetchOptions.body = JSON.stringify(body)}

	const failedToFetchReturn = null
	const debugInfo = {url: link,fetchOptions: {...fetchOptions, body:body}}
	debug && console.log(debugInfo)
	return Promise.race([
		fetch(link, fetchOptions),
		new Promise((resolve)=>{
			console.log('request failed:')
			console.log(debugInfo)
			setTimeout(resolve, timeout, failedToFetchReturn)
		})
	])
}

export default fetchy