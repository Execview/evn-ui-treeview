import {useRef, useLayoutEffect, useState} from 'react'

const useFunctionalRef = (initialValue) => {
	const myRef = useRef(initialValue)
	const [selfRef, setSelfRef] = useState({current: initialValue})
	useLayoutEffect(()=>{
		if(selfRef.current!==myRef.current){
			setSelfRef(myRef)
		}
	})
	return [myRef, selfRef.current]
}

export default useFunctionalRef