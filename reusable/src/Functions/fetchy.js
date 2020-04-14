import nodeFetch from 'node-fetch'

const removeOurOptions = (options) => {
	const {body,debug,token,method,timeout, headers,...otherOptions} = options
	return otherOptions
}

export const fetchy = (url,options={},notJSON=false) => {
	if(!url){console.log('WHERE IS THE LINK?!'); return}

	let body = options.body
	const debug = options.debug || false
	const token = options.token
	const timeout = options.timeout || 3000
	const otherOptions = removeOurOptions(options)


	const hasBody = body!==undefined
	let method = options.method || (hasBody ? 'POST': 'GET')

	let headers = {}
	if(method!=='GET'){headers["Content-Type"] = "application/json"}
	

	let controller = new AbortController();
	let fetchOptions = {
		signal: controller.signal,
		method:method,
		headers: {...headers, ...options.headers},
		...otherOptions
	}
	if(hasBody){
		const contentType = fetchOptions.headers["Content-Type"] || ''
		let fetchBody = body
		if(typeof(body)!=="string" && ['json','text'].some(t=>contentType.includes(t))){fetchBody = JSON.stringify(fetchBody)}
		fetchOptions.body = fetchBody
	}
	
	if(token){fetchOptions.headers["Authorization"] = "Bearer "+token}

	debug && console.log({url: url, fetchOptions: {...fetchOptions, body:body}})

	const fetchFunction = fetch || nodeFetch

	const fetchPromise = fetchFunction(url, fetchOptions)
	return Promise.race([
		notJSON ? fetchPromise : fetchPromise.then(res=>res.json()),
		new Promise((resolve, reject) => setTimeout(() => {reject('too slow! -> '+url); controller.abort()}, timeout))
	])
}

export default fetchy