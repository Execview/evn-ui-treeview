import React, { Component } from 'react';
var Rx = require('rxjs/Rx')

var mousepositionstream = Rx.Observable.fromEvent(document,'mousemove')
var mouseupstream = Rx.Observable.fromEvent(document,'mouseup')

class Scheduler extends Component {
	constructor()
	{
		super();
		this.render = this.render.bind(this)
	}

  render() {
	console.log("render scheduler") 
    return 	<svg width="500" height="500">
				{Days([20,40],[500,200])}
				<EventBubble startpoint={[60,60]} endpoint={[400,100]} colour={'rgb(190,230,240)'}/>
				<EventBubble startpoint={[60,110]} endpoint={[400,150]} colour={'rgb(240,180,190)'}/>
				<EventBubble startpoint={[60,160]} endpoint={[400,200]} colour={'rgb(180,240,200)'}/>
			</svg>
  }
}

class EventBubble extends Component {
	constructor(props)
	{
		super(props);
		this.state = {startpoint: this.props.startpoint, endpoint: this.props.endpoint, colour: this.props.colour}

		this.mousedownpos = [0,0]
		this.dragDiffs = [[0,0],[0,0]] //the vector from mouse down to the start/end points

		this.isleftmousedown = false
		this.isrightmousedown = false
		this.ismiddlemousedown = false

		mousepositionstream.subscribe((event)=>this.mousemove(event))
		mouseupstream.subscribe(()=>{this.isleftmousedown=false;this.isrightmousedown=false;this.ismiddlemousedown=false;})

		this.leftclickdown = this.leftclickdown.bind(this);
		this.rightclickdown = this.rightclickdown.bind(this);
		this.middleclickdown = this.middleclickdown.bind(this);
		this.mousemove = this.mousemove.bind(this);
		this.render = this.render.bind(this);

	}
	leftclickdown(event){this.isleftmousedown = true; this.mousedownpos = [event.nativeEvent.offsetX,event.nativeEvent.offsetY]}
	rightclickdown(event){this.isrightmousedown = true; this.mousedownpos = [event.nativeEvent.offsetX,event.nativeEvent.offsetY]}
	middleclickdown(event){	this.ismiddlemousedown = true
							this.mousedownpos = [event.nativeEvent.offsetX,event.nativeEvent.offsetY]
							this.dragDiffs[0] = [this.mousedownpos[0]-this.state.startpoint[0],this.mousedownpos[1]-this.state.startpoint[1]]
							this.dragDiffs[1] = [this.mousedownpos[0]-this.state.endpoint[0],this.mousedownpos[1]-this.state.endpoint[1]]
							}

	mousemove(event)
	{
		//console.log(this.mousedownpos)
		if(this.isleftmousedown){this.setState({startpoint: [event.offsetX,this.state.startpoint[1]]})}
		if(this.isrightmousedown){this.setState({endpoint: [event.offsetX,this.state.endpoint[1]]})}
		if(this.ismiddlemousedown){
			this.setState({	startpoint: [event.offsetX-this.dragDiffs[0][0],event.offsetY-this.dragDiffs[0][1]],
							endpoint:	[event.offsetX-this.dragDiffs[1][0],event.offsetY-this.dragDiffs[1][1]]})
		}
	}

	render(){return Bubble(this.state.startpoint,this.state.endpoint,this.state.colour,this.leftclickdown,this.rightclickdown,this.middleclickdown)}
}

function Bubble(startpoint, endpoint, 
				colour='rgb(190,230,240)', 
				leftclickdown=()=>console.log("left end down"),
				rightclickdown=()=>console.log("right end down"),
				middleclickdown=()=>console.log("middle part down")) 
	{
		// Must be longer than it is tall
		//Path arcs  rx ry x-axis-rotation large-arc-flag sweep-flag dx dy
		// 'M 70 200 a 2 2 1 1 0 0 100 h 100 a 2 2 1 1 0 0 -100 z' 
		// rgb(190,230,240), rgb(240,180,190), rgb(180,240,200)
		var radius = (endpoint[1]-startpoint[1])/2
		var width = (endpoint[0]-startpoint[0])

		var leftend = 'M '+(startpoint[0]+radius)+" "+startpoint[1]+" a 2 2 1 1 0 0 "+(2*radius)
		var middle = 'M '+(startpoint[0]+radius)+" "+startpoint[1]+" h "+(width-2*radius)+" v "+(2*radius)+" h -"+(width-2*radius)+" z"
		var rightend ='M '+(endpoint[0]-radius)+" "+endpoint[1]+" a 2 2 1 1 0 0 -"+(2*radius)

		return <g>
			<path d={leftend} fill={colour} strokeWidth='0' onMouseDown={leftclickdown}/>
			<path d={middle} fill={colour} strokeWidth='0' onMouseDown={middleclickdown}/>
			<path d={rightend} fill={colour} strokeWidth='0' onMouseDown={rightclickdown}/> 
			</g>
	}

function Days(startpoint, endpoint) //THIS OVERSTEPS ITS BOUNDS BY {daylinespacebuffer} WHICH ALSO MEANS THINGS MIGHT NOT LINE UP AS EXPECTED
	{
		var dayElements = []
		var dayBreakLines = []
		var daysOfTheWeek = ['Mo','Tu','We','Th','Fr','Sa','Su']
		var width=endpoint[0]-startpoint[0]
		for(var i=0; i<daysOfTheWeek.length; i++){
			var horizontalBreakLineHeight = 15
			var	dayLetterShift = [5,10]
			var xpos = startpoint[0]+width*(i/daysOfTheWeek.length)
			//Day
			dayElements.push(<tspan key={2*i} x={xpos+dayLetterShift[0]} y={startpoint[1]+dayLetterShift[1]}>{daysOfTheWeek[i]}</tspan>)
			//Linebreak
			dayBreakLines.push(<line key={2*i+1} stroke='black' strokeWidth='0.5' x1={xpos} x2={xpos} y1={startpoint[1]} y2={endpoint[1]}/>)
		}
		return <g>
					<line stroke='black' strokeWidth='1' x1={startpoint[0]} x2={endpoint[0]} y1={startpoint[1]+horizontalBreakLineHeight} y2={startpoint[1]+horizontalBreakLineHeight}/>
					<text>{dayElements}</text>
					{dayBreakLines}
				</g>
	}

export default Scheduler;
