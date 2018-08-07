import React, { Component } from 'react';
import EventBubble from './EventBubble'
var Rx = require('rxjs/Rx')

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
		this.bubbleHeight = 50
		for(var i=0;i<numberofsnaps[0]+1;i++){this.barsnaps[0].push(this.dimensions[0]*i/numberofsnaps[0])}
		for(var j=0;j<numberofsnaps[1]+1;j++){this.barsnaps[1].push(this.dimensions[1]*j/numberofsnaps[1])}

		this.bubblemessagestream = new Rx.Subject();
		this.bubbles=[
			new EventBubble({key:0, startpoint:[50,75], width: 350, height: this.bubbleHeight, colour:'rgb(190,230,240)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream}),
			new EventBubble({key:1, startpoint:[50,175], width: 350, height: 50, colour:'rgb(240,180,190)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream}),
			new EventBubble({key:2, startpoint:[50,275], width: 350, height: 50, colour:'rgb(180,240,200)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream}),
			new EventBubble({key:3, startpoint:[50,375], width: 350, height: 50, colour:'rgb(250,250,190)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream}),
			new EventBubble({key:4, startpoint:[50,475], width: 350, height: 50, colour:'rgb(240,190,250)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream})]
		
		this.bubblemessagestream.subscribe(	(message)=>{if(message[0]==='state'){
														this.bubbleRequestState(this.bubbles[message[1]],message[2])}
														else if(message[0]==='linkup'){this.lastup=[message[1],message[2]]}
														else if(message[0]==='linklift'){this.performLink(message[1],message[2])}
														}) //this is quite a dumb id/key system. probably fix later... 

		this.lastup = [0,'left']
		this.links = []
	}
	
	bubbleRequestState(bubble,changes)
	{	//deal with snapping here. The bubble will just request a state change to the position of the mouse. You can also do collision here
		var teststate = Object.assign(bubble.state,changes)

		if(teststate.width<teststate.height){
			bubble.state = Object.assign(bubble.state,{width:teststate.height}) //fix
			this.forceUpdate()
		}
		else if(this.noCollisions(bubble.key,teststate)){
			bubble.state = teststate
			this.forceUpdate()
		}else{console.log('collision!')}
	}

	noCollisions(key,teststate)
	{
		var bubbleswithoutthis = this.bubbles.slice()
		bubbleswithoutthis.splice(key,1)
		var nocollision = true
		bubbleswithoutthis.forEach((aBubble)=>{
			if((aBubble.state.startpoint[1]===teststate.startpoint[1]) && 
			(	(teststate.startpoint[0]>aBubble.state.startpoint[0]
				&&
				teststate.startpoint[0]<aBubble.state.startpoint[0]+aBubble.state.width)
			||
				(teststate.startpoint[0]+teststate.width>aBubble.state.startpoint[0]
				&&
				teststate.startpoint[0]+teststate.width<aBubble.state.startpoint[0]+aBubble.state.width)
			||
				(teststate.startpoint[0]<aBubble.state.startpoint[0] 
				&&
				teststate.startpoint[0]+teststate.width>aBubble.state.startpoint[0]+aBubble.state.width)
			)			
			){nocollision=false}
		})
		return nocollision
	}

	performLink(liftkey,liftside){
		var upkey=this.lastup[0]
		var upside=this.lastup[1]
		
		if(this.links.indexOf(liftkey+' '+liftside+' '+upkey+' '+upside)===-1 && this.links.indexOf(upkey+' '+upside+' '+liftkey+' '+liftside)===-1){
		this.links.push(liftkey+' '+liftside+' '+upkey+' '+upside)
		console.log(liftkey+' '+liftside+' '+upkey+' '+upside)
		}
		else{console.log('already linked!')}
		console.log(this.links)
		}

  	render() {
		console.log("render scheduler")
		
		return 	<svg width={this.dimensions[0]} height={this.dimensions[1]}>
					{Columns([0,0],this.dimensions,this.displaycols,[5,15],20)}
					{this.bubbles.map((b)=>b.render())})	
				</svg>
	}
}

function Columns(startpoint, endpoint, columnTitles,colLetterShift=[5,10], horizontalBreakLineHeight=15)
	{	//TODO change input to accept titles and cell positions
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
