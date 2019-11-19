import React, { useState, useEffect, useLayoutEffect } from 'react'
import {useFunctionalRef} from '@execview/reusable'

const getRandom = (n) => parseInt(n*Math.random())

const BadComponent = (props) => {
	const [large,small] = [300,50]
	const [ref, current] = useFunctionalRef()
	const [forcedHeight, setForcedHeight] = useState(small)
	const [actualHeight, setActualHeight] = useState(forcedHeight)

	useLayoutEffect(()=>{
		if(!current){return}
		const dimensions = current.getBoundingClientRect()
		if(props.afterRender && dimensions.height!==actualHeight){
			setActualHeight(dimensions.height)
			props.afterRender(dimensions.height)
		}
	})

	
	useEffect(()=>{
		setTimeout(()=>{
			setForcedHeight(large)
		},3000)
	},[])

	const randomColour = `rgb(${getRandom(255)},${getRandom(255)},${getRandom(255)})`
	const badComponentStyle = {
		backgroundColor: randomColour,
		height: forcedHeight,
		...props.style
	}

	return (
		<div ref={ref} style={badComponentStyle}>
			<div>{`${props.i}: ${props.date}`}</div>
			<button onClick={()=>setForcedHeight(forcedHeight===small?large:small)}>change height</button>
		</div>
	)
}

export default BadComponent