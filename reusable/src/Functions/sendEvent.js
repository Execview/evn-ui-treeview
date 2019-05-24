
const sendEvent = (token,link,type,argPayload,options={})=>{
	
	if(!(token && link && type)){console.log('missing arguments for sending events'); return}
	const payload = argPayload || {}
	const holder = options.holder || ''
	const method = options.method || 'POST'
	const aggregate = type.split('.')[0]

	let Eventbody = {
		type: type,
		aggregate: aggregate,
		data: {
			meta: {
				source: "local",
				correlation_id: null,
				causation_id: null,
			},
			payload: payload
		}
	}
	if(holder){Eventbody.data.meta.holder = holder}

	return fetch(link, {
		method:method,
		headers: {
			"Content-Type": "application/json",
			"Authorization": `Bearer ${token}`
		},
		body:JSON.stringify(Eventbody)
	})
}

export default sendEvent