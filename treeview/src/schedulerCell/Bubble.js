import React from 'react';
import getBubblePath from './getBubblePath'

const Bubble = React.memo((props) => {
	//var startpoint, var endpoint
	var colour = props.colour || 'rgb(190,230,240)'
	var leftclickdown = props.leftclickdown || (()=>console.log("left end down"))
	var rightclickdown = props.rightclickdown || (()=>console.log("right end down"))
	var middleclickdown = props.middleclickdown || (()=>console.log("middle part down"))
	var leftclickup = props.leftclickup || (()=>console.log("left end up"))
	var rightclickup = props.rightclickup || (()=>console.log("right end up"))
	var middleclickup = props.middleclickup || (()=>console.log("middle part up"))
	var leftmousein = props.leftmousein || (()=>console.log("left mouse in"))
	var leftmouseout = props.leftmouseout || (()=>console.log("left mouseout"))
	var rightmousein = props.rightmousein || (()=>console.log("right mouse in"))
	var rightmouseout = props.rightmouseout || (()=>console.log("right mouseout"))
	var middlemousein = props.middlemousein || (()=>console.log("middle mouse in"))
	var middlemouseout = props.middlemouseout || (()=>console.log("middle mouseout"))
	var onContextMenu = props.onContextMenu || (()=>console.log("context menu"))
	var leftcolour = props.leftcolour 
	var rightcolour = props.rightcolour
	var key = props.bkey
	var text = props.text
	var shape = props.shape || 'bubble'
	var editableSides = props.editableSides || ['left','middle','right']

	const {leftend, middle, rightend} = getBubblePath(shape, props.startpoint, props.endpoint)

	let filterStyle = !props.shadow ? 'url(#'+key+')' : ''
	const getCursorStyle = (side) =>  editableSides.includes(side) ? {cursor: 'pointer'} : {};
	return(
		<g key={key} onContextMenu={(event=>onContextMenu(key,event))}>
			<defs>
				<filter id={key}>
					<feDropShadow dx="0" dy="0" floodColor={"black"} stdDeviation="1"/>
				</filter>
			</defs>
			{middle && !isNaN(props.startpoint[0]) && <path d={middle} fill={colour} strokeWidth='0' style={getCursorStyle('middle')}
				onPointerDown   =	{(event)=>middleclickdown(key,event)}
				onPointerUp     =   {(event)=>middleclickup(key,event)}
				onPointerEnter  =	{(event)=>middlemousein(key,event)}
				onPointerLeave  =	{(event)=>middlemouseout(key,event)}/>}
			{leftend && !isNaN(props.startpoint[0]) && <path d={leftend} fill={leftcolour} strokeWidth='0' style={getCursorStyle('left')}
				onPointerDown   =	{(event)=>leftclickdown(key,event)}
				onPointerUp     =	{(event)=>leftclickup(key,event)}
				onPointerEnter  =	{(event)=>leftmousein(key,event)}
				onPointerLeave  =	{(event)=>leftmouseout(key,event)}/>}
			{rightend && !isNaN(props.startpoint[0]) && <path d={rightend} fill={rightcolour} strokeWidth='0' style={getCursorStyle('right')}
				onPointerDown   =	{(event)=>rightclickdown(key,event)}
				onPointerUp     =	{(event)=>rightclickup(key,event)}
				onPointerEnter  =	{(event)=>rightmousein(key,event)}
				onPointerLeave  =	{(event)=>rightmouseout(key,event)}/>}

			{!['triangle','diamond'].includes(shape) && !isNaN(props.startpoint[0]) && <text style={{filter:filterStyle, fill: 'white', MozUserSelect:"none", WebkitUserSelect:"none", msUserSelect:"none", pointerEvents: "none"}}
				x={(props.startpoint[0]+props.endpoint[0])/2}
				y={(props.startpoint[1]+props.endpoint[1])/2}
				textAnchor='middle'
				alignmentBaseline='middle'>{text}
				</text>}
		</g>
	);
})
export default Bubble