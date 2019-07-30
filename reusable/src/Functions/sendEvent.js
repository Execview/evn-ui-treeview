
const sendEvent = (token,link,argPayload,options={})=>{
	
	if(!(token && link)){console.log('missing arguments for sending events'); return}
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

	const fetchOptions = {
		method:method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
		body:JSON.stringify(body)
	}

	debug && console.log({url: link,fetchOptions: fetchOptions})

	return fetch(link, fetchOptions)
}

export default sendEvent