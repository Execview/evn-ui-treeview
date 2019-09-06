const getBubblePath = (shape,startpoint,endpoint) => {
	
	// Must be longer than it is tall
	//Path arcs  rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
	// 'M 70 200 a 2 2 1 1 0 0 100 h 100 a 2 2 1 1 0 0 -100 z' 
	// rgb(190,230,240), rgb(240,180,190), rgb(180,240,200)

	var leftend = null
	var middle = null
	var rightend = null

	if(!startpoint || !endpoint){return {leftend,middle,rightend}}

	const s = {x: startpoint[0], y: startpoint[1]}
	const e = {x: endpoint[0], y: endpoint[1]}

	const defaultMiddle = 'M '+(s.x)+" "+s.y+" h "+(e.x-s.x)+" v "+(e.y-s.y)+" h "+-1*(e.x-s.x)+" z"
	switch(shape){
		case 'bubble': {
			let r = (e.y-s.y)/2
			let width = (e.x-s.x)
			leftend = `M ${s.x+r} ${s.y} a 2 2 1 1 0 0 ${2*r} a 2 2 1 1 0 0 ${-2*r}`
			middle = 'M '+(s.x+r)+" "+s.y+" h "+(width-2*r)+" v "+(2*r)+" h "+-1*(width-2*r)+" z"
			rightend =`M ${e.x-r} ${e.y} a 2 2 1 1 0 0 ${-2*r} a 2 2 1 1 0 0 ${2*r}`

			if((e.x-s.x)<=r*4){leftend=null; rightend=null; middle=defaultMiddle}
			break;
		}
		case 'invertedBubble': {
			let r = (e.y-s.y)/2
			let width = (e.x-s.x)
			let sideWidth = 2*r
			leftend = `M ${s.x} ${s.y} a 1 1 1 0 1 0 ${2*r} h ${sideWidth} 0 v 0 ${-2*r}`
			middle = `M ${s.x+sideWidth} ${s.y} h ${width-2*sideWidth} v ${2*r} h ${-1*(width-2*sideWidth)} z`
			rightend = `M ${e.x} ${s.y} a 1 1 1 0 0 0 ${2*r} h ${-1*sideWidth} 0 v 0 ${-2*r}`

			if((e.x-s.x)<=sideWidth*2){leftend=null; rightend=null; middle=defaultMiddle}
			break;
		}
		case 'arrow': {
			let thickness = e.y-s.y
			let width = (e.x-s.x)
			leftend = `M ${s.x} ${s.y+(thickness)/2} l ${thickness/2} ${thickness/2} l ${thickness/2} ${-thickness/2} l ${-thickness/2} ${-thickness/2} z`
			middle = `M ${s.x+thickness/2} ${s.y} h ${width-thickness} v ${thickness} h ${-1*(width-thickness)} z`
			rightend =`M ${e.x-thickness} ${e.y-(thickness)/2} l ${thickness/2} ${thickness/2} l ${thickness/2} ${-thickness/2} l ${-thickness/2} ${-thickness/2} z`

			if((e.x-s.x)<=thickness){leftend=null; rightend=null; middle=defaultMiddle}
			break;
		}
		case 'rhombus': {
			let thickness = e.y-s.y
			let sideWidth = thickness
			let width = (e.x-s.x)
			leftend = `M ${s.x} ${s.y+thickness} l ${sideWidth/2} ${-thickness} h ${sideWidth/2} l ${-sideWidth/2} ${thickness} z`
			middle = 'M '+(s.x+thickness/2)+" "+s.y+" h "+(width-thickness)+" v "+thickness+" h "+(-1*(width-thickness))+" z"
			rightend =`M ${e.x-sideWidth} ${e.y} l ${sideWidth/2} ${-thickness} h ${sideWidth/2} l ${-sideWidth/2} ${thickness} z`

			if((e.x-s.x)<=thickness){leftend=null; rightend=null; middle=defaultMiddle}
			break;
		}
		case 'cracker': {
			let thickness = e.y-s.y
			let sideWidth = thickness
			let width = (e.x-s.x)
			leftend = `M ${s.x} ${s.y} h ${sideWidth} v ${thickness} h ${-sideWidth} l ${sideWidth/2} ${-thickness/2} z`
			middle = `M ${s.x+thickness/2} ${s.y} h ${width-thickness} v ${thickness} h ${-1*(width-thickness)} z`
			rightend =`M ${e.x} ${e.y-thickness} h ${-sideWidth} v ${thickness} h ${sideWidth} l ${-sideWidth/2} ${-thickness/2} z`

			if((e.x-s.x)<=sideWidth*2){leftend=null; rightend=null; middle=defaultMiddle}
			break;
		}
		case 'square': {
			let thickness = e.y-s.y
			let sideWidth = thickness/2
			let width = (e.x-s.x)
			leftend = `M ${s.x} ${s.y} h ${sideWidth} v ${thickness} h ${-sideWidth} z`
			middle = 'M '+(s.x+thickness/2)+" "+s.y+" h "+(width-thickness)+" v "+thickness+" h "+(-1*(width-thickness))+" z"
			rightend =`M ${e.x-sideWidth} ${e.y-thickness} h ${sideWidth} v ${thickness} h ${-sideWidth} z`

			if((e.x-s.x)<=sideWidth*2){leftend=null; rightend=null; middle=defaultMiddle}
			break;
		}
			
		case 'triangle': {
			let thickness = e.y-s.y
			middle = 'M '+s.x+" "+(s.y+thickness)+" h "+thickness+" l "+(-1*thickness/2)+" "+(-1*thickness)+" z"
			break;
		}
		case 'diamond': {
			let thickness = e.y-s.y
			middle = `M ${s.x} ${s.y+(thickness)/2} L ${(s.x+(thickness)/2)} ${s.y+(thickness)} L ${s.x+(thickness)} ${s.y+(thickness)/2} L ${s.x+thickness/2} ${s.y} z`
			break;
		}
		default: break;
	}
	return {leftend, middle, rightend}
}

export default getBubblePath