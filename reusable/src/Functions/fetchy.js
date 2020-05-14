import nodeFetch from 'node-fetch'
import AC from 'abort-controller';

const removeOurOptions = (options) => {
	const {body,debug,token,method,timeout, headers,...otherOptions} = options
	return otherOptions
}

const globalStringOrAlt = (globalString, alt) =>{
	let result = alt
	try {
		result = eval(globalString)
	} catch (e) {

	}
	return result
}

export const fetchy = (url,options={},notJSON=false) => {
	const [fetchFunction, AbortControllerClass] = [globalStringOrAlt('fetch', nodeFetch),globalStringOrAlt('AbortController', AC)]
	if(!url){console.log('WHERE IS THE LINK?!'); return}

	let body = options.body
	const previewMode = options.preview!==undefined //for when you dont want to perform the fetch, but want to debug. (the value of options.preview is resolved)
	const debug = options.debug || previewMode
	const token = options.token
	const timeout = options.timeout || 3000
	const otherOptions = removeOurOptions(options)


	const hasBody = body!==undefined
	let method = options.method || (hasBody ? 'POST': 'GET')

	let headers = {}
	if(method!=='GET'){headers["Content-Type"] = "application/json"}
	
	let controller = new AbortControllerClass();
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

	let fetchPromise = previewMode ? Promise.resolve(options.preview) : fetchFunction(url, fetchOptions).then(res=>{return res})
	if(!notJSON){fetchPromise = fetchPromise.then(res=>res.json())}
	if(debug){fetchPromise = fetchPromise.then((res)=>{console.log(res); return res})}
	return Promise.race([
		fetchPromise,
		new Promise((resolve, reject) => setTimeout(() => {reject('too slow! -> '+url); controller.abort()}, timeout))
	])
}

export default fetchy