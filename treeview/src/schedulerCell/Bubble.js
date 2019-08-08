import React from 'react';
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

	// Must be longer than it is tall
	//Path arcs  rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
	// 'M 70 200 a 2 2 1 1 0 0 100 h 100 a 2 2 1 1 0 0 -100 z' 
	// rgb(190,230,240), rgb(240,180,190), rgb(180,240,200)

	var leftend = null
	var middle = null
	var rightend = null

	const defaultMiddle = 'M '+(props.startpoint[0])+" "+props.startpoint[1]+" h "+(props.endpoint[0]-props.startpoint[0])+" v "+(props.endpoint[1]-props.startpoint[1])+" h "+-1*(props.endpoint[0]-props.startpoint[0])+" z"
	switch(shape){
		case 'bubble': {
			let radius = (props.endpoint[1]-props.startpoint[1])/2
			let width = (props.endpoint[0]-props.startpoint[0])
			leftend = 'M '+(props.startpoint[0]+radius)+" "+props.startpoint[1]+" a 2 2 1 1 0 0 "+(2*radius)
			middle = 'M '+(props.startpoint[0]+radius)+" "+props.startpoint[1]+" h "+(width-2*radius)+" v "+(2*radius)+" h "+-1*(width-2*radius)+" z"
			rightend ='M '+(props.endpoint[0]-radius)+" "+props.endpoint[1]+" a 2 2 1 1 0 0 "+(-2*radius)

			if((props.endpoint[0]-props.startpoint[0])<=radius*2){leftend=null; rightend=null; middle=defaultMiddle}
			break;
		}
		case 'square': {
			let thickness = props.endpoint[1]-props.startpoint[1]
			let width = (props.endpoint[0]-props.startpoint[0])
			//leftend = 'M '+props.startpoint[0]+" "+props.startpoint[1]+" h "+thickness/2+" v "+thickness+" h "+(-1*thickness/2)+" z"
			leftend = `M ${props.startpoint[0]} ${props.startpoint[1]+(thickness)/2} L ${(props.startpoint[0]+(thickness)/2)} ${props.startpoint[1]+(thickness)} L ${props.startpoint[0]+thickness/2} ${props.startpoint[1]} z`
			middle = 'M '+(props.startpoint[0]+thickness/2)+" "+props.startpoint[1]+" h "+(width-thickness)+" v "+thickness+" h "+(-1*(width-thickness))+" z"
			//rightend ='M '+(props.endpoint[0]-thickness/2)+" "+(props.endpoint[1]-thickness)+" h "+thickness/2+" v "+thickness+" h "+(-1*thickness/2)+" z"
			rightend =`M ${props.endpoint[0]} ${props.endpoint[1]-(thickness)/2} L ${(props.endpoint[0]-thickness/2)} ${props.endpoint[1]-thickness} L ${props.endpoint[0]-thickness/2} ${props.endpoint[1]} z`

			if((props.endpoint[0]-props.startpoint[0])<=thickness){leftend=null; rightend=null; middle=defaultMiddle}
			break;
		}
			
		case 'triangle': {
			let thickness = props.endpoint[1]-props.startpoint[1]
			//middle = 'M '+props.startpoint[0]+" "+(props.startpoint[1]+thickness)+" h "+thickness+" l "+(-1*thickness/2)+" "+(-1*thickness)+" z"
			middle = `M ${props.startpoint[0]} ${props.startpoint[1]+(thickness)/2} L ${(props.startpoint[0]+(thickness)/2)} ${props.startpoint[1]+(thickness)} L ${props.startpoint[0]+(thickness)} ${props.startpoint[1]+(thickness)/2} L ${props.startpoint[0]+thickness/2} ${props.startpoint[1]} z`
			break;
		}
		default: {console.log(key+" has no shape")}
	}

	let filterStyle = !props.shadow ? 'url(#'+key+')' : ''
	console.log(editableSides)
	const getCursorStyle = (side) =>  editableSides.includes(side) ? {cursor: 'pointer'} : {};
	return(
		<g key={key} onContextMenu={(event=>onContextMenu(key,event))}>
			<defs>
				<filter id={key}>
					<feDropShadow dx="0" dy="0" floodColor={"black"} stdDeviation="1"/>
				</filter>
			</defs>
			{leftend && !isNaN(props.startpoint[0]) && <path d={leftend} fill={leftcolour} strokeWidth='0' style={getCursorStyle('left')}
				onPointerDown   =	{(event)=>leftclickdown(key,event)}
				onPointerUp     =	{(event)=>leftclickup(key,event)}
				onPointerEnter  =	{(event)=>leftmousein(key,event)}
				onPointerLeave  =	{(event)=>leftmouseout(key,event)}/>}
			{middle && !isNaN(props.startpoint[0]) && <path d={middle} fill={colour} strokeWidth='0' style={getCursorStyle('middle')}
				onPointerDown   =	{(event)=>middleclickdown(key,event)}
				onPointerUp     =   {(event)=>middleclickup(key,event)}
				onPointerEnter  =	{(event)=>middlemousein(key,event)}
				onPointerLeave  =	{(event)=>middlemouseout(key,event)}/>}
			{rightend && !isNaN(props.startpoint[0]) && <path d={rightend} fill={rightcolour} strokeWidth='0' style={getCursorStyle('right')}
				onPointerDown   =	{(event)=>rightclickdown(key,event)}
				onPointerUp     =	{(event)=>rightclickup(key,event)}
				onPointerEnter  =	{(event)=>rightmousein(key,event)}
				onPointerLeave  =	{(event)=>rightmouseout(key,event)}/>}

			{shape!=='triangle' && !isNaN(props.startpoint[0]) && <text style={{filter:filterStyle, fill: 'white', MozUserSelect:"none", WebkitUserSelect:"none", msUserSelect:"none", pointerEvents: "none"}}
				x={(props.startpoint[0]+props.endpoint[0])/2}
				y={(props.startpoint[1]+props.endpoint[1])/2}
				textAnchor='middle'
				alignmentBaseline='middle'>{text}
				</text>}
		</g>
	);
})
export default Bubble