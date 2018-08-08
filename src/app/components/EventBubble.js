import React, { Component } from 'react';
var Rx = require('rxjs/Rx')

var mousepositionstream = Rx.Observable.fromEvent(document,'mousemove')

class EventBubble extends Component {
	constructor(props)
	{
		super(props);

		this.state = {startpoint: this.props.startpoint, width: this.props.width, height: this.props.height, colour: this.props.colour, leftcolour: this.props.colour, rightcolour: this.props.colour} //change left and right colour to load to their respective colours
		this.initialcolour = this.props.colour
		this.key=this.props.key
		this.mousedownpos = [0,0]
		this.dragDiffs = [[0,0],[0,0]] //the vector from mouse down to the start/end points
		this.highlightcolour = 'rgb(100,100,100)'

		this.isleftmousedown = false
		this.isrightmousedown = false
		this.ismiddlemousedown = false

		mousepositionstream.subscribe((event)=>this.mousemove(event))

		this.leftclickdown = this.leftclickdown.bind(this);
		this.rightclickdown = this.rightclickdown.bind(this);
		this.middleclickdown = this.middleclickdown.bind(this);
		this.leftclickup = this.leftclickup.bind(this);
		this.rightclickup = this.rightclickup.bind(this);
		this.mousemove = this.mousemove.bind(this);
		this.getNearestValueInArray = this.getNearestValueInArray.bind(this);
		this.leftlift = this.leftlift.bind(this);
		this.rightlift = this.rightlift.bind(this);
		this.leftmousein = this.leftmousein.bind(this);
		this.leftmouseout = this.leftmouseout.bind(this);
		this.rightmousein = this.rightmousein.bind(this);
		this.rightmouseout = this.rightmouseout.bind(this);
		this.requestSetState = this.requestSetState.bind(this);
		this.render = this.render.bind(this);

		this.snaps = this.props.snaps //the list of x's and y's which the bar size and placement should snap to
	}
	leftclickdown(event){	this.isleftmousedown = true; 
							this.mousedownpos = [event.nativeEvent.offsetX,event.nativeEvent.offsetY]
							this.requestSetState({leftcolour:this.highlightcolour})}
	rightclickdown(event){	this.isrightmousedown = true; 
							this.mousedownpos = [event.nativeEvent.offsetX,event.nativeEvent.offsetY]
							this.requestSetState({rightcolour:this.highlightcolour})}
	middleclickdown(event){	this.ismiddlemousedown = true
							this.mousedownpos = [event.nativeEvent.offsetX,event.nativeEvent.offsetY]
							this.dragDiffs[0] = [this.mousedownpos[0]-this.state.startpoint[0],this.mousedownpos[1]-this.state.startpoint[1]]
							}
	leftclickup(event){this.props.bubblemessagestream.next(['linkup',this.props.key,'left'])} //inside bubble
	rightclickup(event){this.props.bubblemessagestream.next(['linkup',this.props.key,'right'])}

	leftlift(){this.props.bubblemessagestream.next(['linklift',this.props.key,'left'])} //anywhere
	rightlift(){this.props.bubblemessagestream.next(['linklift',this.props.key,'right'])}

	leftmousein(event){if(event.buttons!==0){this.requestSetState({leftcolour: this.highlightcolour})}}
	leftmouseout(event){if(!this.isleftmousedown && event.buttons!==0){this.getOriginalColour('left')}}
	rightmousein(event){if(event.buttons!==0){this.requestSetState({rightcolour: this.highlightcolour})}}
	rightmouseout(event){if(!this.isrightmousedown && event.buttons!==0){this.getOriginalColour('right')}}
			
	mousemove(event)
	{
		if(event.buttons===0) {	if(this.isleftmousedown){this.leftlift()};
								if(this.isrightmousedown){this.rightlift()};
								this.isleftmousedown=false;
								this.isrightmousedown=false;
								this.ismiddlemousedown=false;
								if(this.state.leftcolour===this.highlightcolour || this.state.rightcolour===this.highlightcolour){
									this.getOriginalColour('left')
									this.getOriginalColour('right')
									}}
		//TODO MOVE SNAPPING (getNearestValueInArray stuff) into scheduler. Then you wont need to pass snaps. It also means snaps can change when you move eventbubbles
		if(this.isleftmousedown){	var newX = this.getNearestValueInArray(this.snaps[0],event.offsetX); 
									this.requestSetState({startpoint: [newX,this.state.startpoint[1]], width: this.state.width-(newX-this.state.startpoint[0])})}
		if(this.isrightmousedown){	var newX = this.getNearestValueInArray(this.snaps[0],event.offsetX)
									this.requestSetState({width: newX-(this.state.startpoint[0])})}
		if(this.ismiddlemousedown){	
			this.requestSetState({startpoint: [this.getNearestValueInArray(this.snaps[0],event.offsetX-this.dragDiffs[0][0]),this.getNearestValueInArray(this.snaps[1],event.offsetY)-this.state.height/2]})
		}
	}
	requestSetState(changes){this.props.bubblemessagestream.next(['state',this.props.key,changes])}
	getOriginalColour(side){this.props.bubblemessagestream.next(['initialcolour',this.props.key,side])}
	getNearestValueInArray(snapsarray,value){ if(snapsarray===[]){return value}
		var distancefromsnapsarray = snapsarray.slice().map((i)=>Math.abs(i-value))
		return snapsarray[distancefromsnapsarray.indexOf(Math.min(...distancefromsnapsarray))]
	}
	
	

	render(){return Bubble(this.state.startpoint,[(this.state.startpoint[0]+this.state.width),(this.state.startpoint[1]+this.state.height)],this.state.colour,this.leftclickdown,this.rightclickdown,this.middleclickdown,this.leftclickup,this.rightclickup,this.leftmousein, this.leftmouseout,this.rightmousein,this.rightmouseout,this.state.leftcolour,this.state.rightcolour,this.props.key)}
}

function Bubble(startpoint, endpoint, 
				colour='rgb(190,230,240)', 
				leftclickdown=()=>console.log("left end down"),
				rightclickdown=()=>console.log("right end down"),
				middleclickdown=()=>console.log("middle part down"),
				leftclickup=()=>console.log("left end up"),
				rightclickup=()=>console.log("right end up"),
				leftmousein=()=>console.log("left mouse in"),
				leftmouseout=()=>console.log("left mouseout"),
				rightmousein=()=>console.log("right mouse in"),
				rightmouseout=()=>console.log("right mouseout"),
				leftcolour=null, rightcolour=null, key=null) 
	{
		// Must be longer than it is tall
		//Path arcs  rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
		// 'M 70 200 a 2 2 1 1 0 0 100 h 100 a 2 2 1 1 0 0 -100 z' 
		// rgb(190,230,240), rgb(240,180,190), rgb(180,240,200)
		var radius = (endpoint[1]-startpoint[1])/2
		var width = (endpoint[0]-startpoint[0])

		var leftend = 'M '+(startpoint[0]+radius)+" "+startpoint[1]+" a 2 2 1 1 0 0 "+(2*radius)
		var middle = 'M '+(startpoint[0]+radius)+" "+startpoint[1]+" h "+(width-2*radius)+" v "+(2*radius)+" h "+-1*(width-2*radius)+" z"
		var rightend ='M '+(endpoint[0]-radius)+" "+endpoint[1]+" a 2 2 1 1 0 0 "+(-2*radius)

		return <g key={key}>
			<path d={leftend} fill={leftcolour} strokeWidth='0' onMouseDown={leftclickdown} onMouseUp={leftclickup} onMouseEnter={leftmousein} onMouseOut={leftmouseout}/>
			<path d={middle} fill={colour} strokeWidth='0' onMouseDown={middleclickdown}/>
			<path d={rightend} fill={rightcolour} strokeWidth='0' onMouseDown={rightclickdown} onMouseUp={rightclickup} onMouseEnter={rightmousein} onMouseOut={rightmouseout}/> 
			</g>
	}
	
export default EventBubble;