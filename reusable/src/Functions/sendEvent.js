
const sendEvent = (token,link,argPayload,options={})=>{
	
	if(!(link)){console.log('missing arguments for sending events'); return}
	const payload = argPayload || {}
	const holder = options.holder || ''
	const method = options.method || 'POST'
	const debug = options.debug || false

	let body = {}

	if(holder){
		body = {
			payload: payload,
			meta: {holder: holder}
		}
	} else {
		body = payload
	}

	let headers = {}
	if(method!=='GET'){headers["Content-Type"] = "application/json"}
	if(token){headers["Authorization"] = "Bearer "+token}

	const fetchOptions = {
		method:method,
		headers: headers,
		body:JSON.stringify(body)
	}

	debug && console.log({url: link,fetchOptions: {...fetchOptions, body:body}})

	return fetch(link, fetchOptions)
}

export default sendEvent