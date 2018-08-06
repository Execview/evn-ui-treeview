import React, { Component } from 'react';
var Rx = require('rxjs/Rx')

var mousepositionstream = Rx.Observable.fromEvent(document,'mousemove')

class Scheduler extends Component {
	constructor()
	{
		super();
		var days = ['Mo','Tu','We','Th','Fr','Sa','Su']
		var months = ['Ja','Fe','Ma','Ap','Ma','Ju','JL','Au','Se','Oc','No','De']
		var names = ["James","Andras","Salman","Marisha","Vygantus"]

		this.displaycols = days;
		this.rows = names

		this.render = this.render.bind(this)
		this.dimensions = [window.innerWidth*0.75,500]
		this.barsnaps = [[],[]] //when a bubble is moved, append the x and ys to this list so you can snap to them or line things up to them
		var numberofsnaps = [2*this.displaycols.length,10]
		this.barHeight = 50 //TODO: convert bubbles to take starting point, width and height. height can have a default parameter and you define the bubble with others. It will be easier to manage and detect collisions this way.
		for(var i=0;i<numberofsnaps[0]+1;i++){this.barsnaps[0].push(this.dimensions[0]*i/numberofsnaps[0])}
		for(var j=0;j<numberofsnaps[1]+1;j++){this.barsnaps[1].push(this.dimensions[1]*j/numberofsnaps[1])}

		this.listofbubbles=[{id:1, startpoint:[50,75], width: 350, height: 50, colour:'rgb(190,230,240)', snaps:this.barsnaps},
							{id:2, startpoint:[50,175], width: 350, height: 50, colour:'rgb(240,180,190)', snaps:this.barsnaps},
							{id:3, startpoint:[50,275], width: 350, height: 50, colour:'rgb(180,240,200)', snaps:this.barsnaps},
							{id:4, startpoint:[50,375], width: 350, height: 50, colour:'rgb(250,250,190)', snaps:this.barsnaps},
							{id:5, startpoint:[50,475], width: 350, height: 50, colour:'rgb(240,190,250)', snaps:this.barsnaps}]
		
		this.bubbles = this.listofbubbles.map((b)=><EventBubble key={b.id} startpoint={b.startpoint} width={b.width} height={b.height} colour={b.colour} snaps={b.snaps}/>)

		console.log(this.barsnaps)
	}

  render() {
	console.log("render scheduler")
	
    return 	<svg width={this.dimensions[0]} height={this.dimensions[1]}>
				{Columns([0,0],this.dimensions,this.displaycols,[5,15],20)}
				{this.bubbles}
			</svg>
  }
}

class EventBubble extends Component {
	constructor(props)
	{
		super(props);

		this.state = {startpoint: this.props.startpoint, width: this.props.width, height: this.props.height, colour: this.props.colour}

		this.mousedownpos = [0,0]
		this.dragDiffs = [[0,0],[0,0]] //the vector from mouse down to the start/end points

		this.isleftmousedown = false
		this.isrightmousedown = false
		this.ismiddlemousedown = false

		mousepositionstream.subscribe((event)=>this.mousemove(event))

		this.leftclickdown = this.leftclickdown.bind(this);
		this.rightclickdown = this.rightclickdown.bind(this);
		this.middleclickdown = this.middleclickdown.bind(this);
		this.mousemove = this.mousemove.bind(this);
		this.getNearestValueInArray = this.getNearestValueInArray.bind(this);
		this.render = this.render.bind(this);

		this.snaps = this.props.snaps //the list of x's and y's which the bar size and placement should snap to
	}
	leftclickdown(event){this.isleftmousedown = true; this.mousedownpos = [event.nativeEvent.offsetX,event.nativeEvent.offsetY]}
	rightclickdown(event){this.isrightmousedown = true; this.mousedownpos = [event.nativeEvent.offsetX,event.nativeEvent.offsetY]}
	middleclickdown(event){	this.ismiddlemousedown = true
							this.mousedownpos = [event.nativeEvent.offsetX,event.nativeEvent.offsetY]
							this.dragDiffs[0] = [this.mousedownpos[0]-this.state.startpoint[0],this.mousedownpos[1]-this.state.startpoint[1]]
							this.dragDiffs[1] = [this.mousedownpos[0]-(this.state.startpoint[0]+this.state.width),this.mousedownpos[1]-(this.state.startpoint[1]+this.state.height)]
							}
							
	mousemove(event)
	{
		if(event.buttons===0) {this.isleftmousedown=false;this.isrightmousedown=false;this.ismiddlemousedown=false;}
		if(this.isleftmousedown){	var newX = this.getNearestValueInArray(this.snaps[0],event.offsetX); 
									this.setState({startpoint: [newX,this.state.startpoint[1]], width: this.state.width-(newX-this.state.startpoint[0])})}
		if(this.isrightmousedown){	var newX = this.getNearestValueInArray(this.snaps[0],event.offsetX)
									this.setState({width: newX-(this.state.startpoint[0])})}
		if(this.ismiddlemousedown){	this.setState({startpoint: [event.offsetX-this.dragDiffs[0][0],this.getNearestValueInArray(this.snaps[1],event.offsetY)-this.state.height/2]})}
	}
	getNearestValueInArray(snapsarray,value){ if(snapsarray===[]){return value}
		var distancefromsnapsarray = snapsarray.slice().map((i)=>Math.abs(i-value))
		return snapsarray[distancefromsnapsarray.indexOf(Math.min(...distancefromsnapsarray))]
	}

	render(){return Bubble(this.state.startpoint,[(this.state.startpoint[0]+this.state.width),(this.state.startpoint[1]+this.state.height)],this.state.colour,this.leftclickdown,this.rightclickdown,this.middleclickdown)}
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
		var middle = 'M '+(startpoint[0]+radius)+" "+startpoint[1]+" h "+(width-2*radius)+" v "+(2*radius)+" h "+-1*(width-2*radius)+" z"
		var rightend ='M '+(endpoint[0]-radius)+" "+endpoint[1]+" a 2 2 1 1 0 0 "+(-2*radius)

		return <g>
			<path d={leftend} fill={colour} strokeWidth='0' onMouseDown={leftclickdown}/>
			<path d={middle} fill={colour} strokeWidth='0' onMouseDown={middleclickdown}/>
			<path d={rightend} fill={colour} strokeWidth='0' onMouseDown={rightclickdown}/> 
			</g>
	}

function Columns(startpoint, endpoint, columnTitles,colLetterShift=[5,10], horizontalBreakLineHeight=15)
	{
		var dayElements = []
		var dayBreakLines = []
		
		var width=endpoint[0]-startpoint[0]
		for(var i=0; i<columnTitles.length; i++){
			var xpos = startpoint[0]+width*(i/columnTitles.length)
			//Day
			dayElements.push(<tspan key={2*i} x={xpos+colLetterShift[0]} y={startpoint[1]+colLetterShift[1]}>{columnTitles[i]}</tspan>)
			//Linebreak
			dayBreakLines.push(<line key={2*i+1} stroke='black' strokeWidth='0.5' x1={xpos} x2={xpos} y1={startpoint[1]} y2={endpoint[1]}/>)
		}
		return <g style={{MozUserSelect:"none", WebkitUserSelect:"none", msUserSelect:"none"}}>
					<line stroke='black' strokeWidth='1' x1={startpoint[0]} x2={endpoint[0]} y1={startpoint[1]+horizontalBreakLineHeight} y2={startpoint[1]+horizontalBreakLineHeight}/>
					<text>{dayElements}</text>
					{dayBreakLines}
				</g>
	}

export default Scheduler;
