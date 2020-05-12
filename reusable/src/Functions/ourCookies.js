export const getOurCookie = (originalCookie,getProperty) => {
	const cookieString = decodeURIComponent(originalCookie);
	if(!cookieString || cookieString==='null' || cookieString==='undefined'){return null}
	const cookiePropertyMap = cookieString.split(';').map(property=>{return property.trimLeft().split("=")})
	const cookie = cookiePropertyMap.reduce((total,p)=>{return {...total,[p[0]]:p[1]}},{});
	if(getProperty){return cookie[getProperty]}
	return cookie;
}

export const setOurCookie = (setFunction, o) => {
	if(Object.keys(o||{}).length===0){return}
	Object.entries(o).forEach(([c,v])=>{
		const newCookie = v ? `${c}=${v}; expires=${new Date('2970-01-01').toUTCString()}; path=/` : `${c}=; expires=${new Date('1970-01-01').toUTCString()}; path=/`
		console.log(newCookie)
		setFunction(newCookie)
	})
}
