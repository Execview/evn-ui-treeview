import React, { Component } from 'react';
import EventBubble from './EventBubble'
var Rx = require('rxjs/Rx')

class Scheduler extends Component {
	constructor()
	{
		super();
		var week = ['Mo','Tu','We','Th','Fr','Sa','Su']
		var month = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
		var year = ['Ja','Fe','Ma','Ap','Ma','Ju','JL','Au','Se','Oc','No','De']
		var names = ["James","Andras","Salman","Marisha","Vygantus"]

		this.displaycols = week;
		this.rows = names

		this.schedulerDimensions = [window.innerWidth*0.85,700]
			this.barsnaps = [[],[]] //when a bubble is moved, append the x and ys to this list so you can snap to them or line things up to them
			var numberofXsnaps = 2*this.displaycols.length
		this.bubbleDimensions = [2*this.schedulerDimensions[0]/numberofXsnaps,50]

		this.render = this.render.bind(this)
		
		
		for(var i=0;i<numberofXsnaps+1;i++){this.barsnaps[0].push(this.bubbleDimensions[0]*i)}
		for(var j=0;this.bubbleDimensions[1]*j<this.schedulerDimensions[1];j++){this.barsnaps[1].push(this.bubbleDimensions[1]*j)}
		
		this.bubblemessagestream = new Rx.Subject();
		this.bubbles=[
			/*new EventBubble({key:0, startpoint:[this.barsnaps[0][4],this.barsnaps[1][2]+this.bubbleDimensions[1]/2], width: this.bubbleDimensions[0], height: this.bubbleDimensions[1], colour:'rgb(190,230,240)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream}),
			new EventBubble({key:1, startpoint:[this.barsnaps[0][4],this.barsnaps[1][3]+this.bubbleDimensions[1]/2], width: this.bubbleDimensions[0], height: this.bubbleDimensions[1], colour:'rgb(240,180,190)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream}),
			new EventBubble({key:2, startpoint:[this.barsnaps[0][4],this.barsnaps[1][5]+this.bubbleDimensions[1]/2], width: this.bubbleDimensions[0], height: this.bubbleDimensions[1], colour:'rgb(180,240,200)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream}),
			new EventBubble({key:3, startpoint:[this.barsnaps[0][4],this.barsnaps[1][6]+this.bubbleDimensions[1]/2], width: this.bubbleDimensions[0], height: this.bubbleDimensions[1], colour:'rgb(250,250,190)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream}),
			new EventBubble({key:4, startpoint:[this.barsnaps[0][4],this.barsnaps[1][8]+this.bubbleDimensions[1]/2], width: this.bubbleDimensions[0], height: this.bubbleDimensions[1], colour:'rgb(240,190,250)', snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream})
			*/]
		
		this.bubblemessagestream.subscribe(	(message)=>{if(message[0]==='state'){this.bubbleRequestState(this.bubbles[message[1]],message[2])}
														else if(message[0]==='linkup'){this.lastup=[message[1],message[2]]}
														else if(message[0]==='linklift'){console.log('lift');this.performLink(message[1],message[2])}
														else if(message[0]==='initialcolour'){this.setInitialColour(message[1],message[2])}
														}) //this is quite a dumb id/key system. probably fix later... 

		this.lastup = null
		this.links = []

		this.newbubblecolour = 'rgb(190,230,240)'

		this.makeNewBubble = this.makeNewBubble.bind(this);
	}
	
	bubbleRequestState(bubble,changes) //Stop passing bubble and instead pass the changes, which will contain the bubble key if it requires changing
	{	//deal with snapping here. The bubble will just request a state change to the position of the mouse. You can also do collision here
		var teststate = Object.assign(bubble.state,changes)//will later have to be the whole state including all bubble positions to test for nocollisions when moving linked bubbles


		if(teststate.width<teststate.height){
			bubble.state = Object.assign(bubble.state,{startpoint: bubble.state.startpoint}) //fix
			this.forceUpdate()
		}
		else if(this.noCollisions(bubble.key,teststate)){
			var islinkedto = []
			this.links.forEach((linkstring)=>{var link=linkstring.split(" ");if(link[0]==bubble.key){
				var linkedbubble = this.bubbles[link[2]]
				var endpoint = [teststate.startpoint[0]+teststate.width,teststate.startpoint[1]+teststate.height]
				var newX = null
				if(link[1]==='right'){newX = endpoint[0]}else{newX =teststate.startpoint[0]}				
				if(link[3]==='right'){this.bubbleRequestState(linkedbubble,{startpoint: [newX-linkedbubble.state.width,linkedbubble.state.startpoint[1]]})}
				else{this.bubbleRequestState(linkedbubble,{startpoint: [newX,linkedbubble.state.startpoint[1]]})}
			}})
			bubble.state = teststate
			this.forceUpdate()
		}
		else{console.log('collision!')}
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
		if(this.lastup!==null)
		{
			var upkey=this.lastup[0]
			var upside=this.lastup[1]			
			if(this.links.indexOf(liftkey+' '+liftside+' '+upkey+' '+upside)===-1 && this.links.indexOf(upkey+' '+upside+' '+liftkey+' '+liftside)===-1 && upkey!==liftkey){
			this.links.push(liftkey+' '+liftside+' '+upkey+' '+upside)
			console.log(liftkey+' '+liftside+' '+upkey+' '+upside)
			console.log(this.links)
			}
			else{console.log('already linked!')}
		}
		this.lastup = null
		}
	setInitialColour(key,side){ console.log('here')
		var colourtoset=this.bubbles[key].initialcolour
		this.links.forEach((l)=>{var link = l.split(" ")
		if(link[2]==key &&link[3]==side){colourtoset = this.bubbles[link[0]].initialcolour}
		})
		if(side=='right'){this.bubbles[key].state = Object.assign(this.bubbles[key].state,{rightcolour:colourtoset})}else{this.bubbles[key].state = Object.assign(this.bubbles[key].state,{leftcolour:colourtoset})}
		this.forceUpdate()
	}
	makeNewBubble()
	{
		var maxY = this.barsnaps[1][0]+this.bubbleDimensions[1]/2
		var maxX = 0
		var maxkey = -1
		this.bubbles.forEach((bubble)=>{if(bubble.state.startpoint[1]>maxY){maxY=bubble.state.startpoint[1]};
										if(bubble.state.startpoint[0]+bubble.state.width>maxX){maxX=bubble.state.startpoint[0]+bubble.state.width};
										if(bubble.key>maxkey){maxkey=bubble.key}})
		var newbubble = new EventBubble({key:maxkey+1, startpoint:[maxX,maxY+this.bubbleDimensions[1]], width: this.bubbleDimensions[0], height: this.bubbleDimensions[1], colour:this.newbubblecolour, snaps:this.barsnaps, bubblemessagestream: this.bubblemessagestream})
		this.bubbles.push(newbubble)
		this.forceUpdate();
	}
  	render() {
		console.log("render scheduler")
		return 	<div>
					<p/>
					<button style={{color:'black',borderColor:'black',backgroundColor:this.newbubblecolour}}>ACTIVE COLOUR </button>
					<button onClick={this.makeNewBubble}>Add bubble</button>
					<button onClick={()=>{this.newbubblecolour='rgb(190,230,240)';this.forceUpdate();}} style={{color:'black',borderColor:'white',backgroundColor:'rgb(190,230,240)'}}>Blue</button>
					<button onClick={()=>{this.newbubblecolour='rgb(240,180,190)';this.forceUpdate()}} style={{color:'black',borderColor:'white',backgroundColor:'rgb(240,180,190)'}}>Red</button>
					<button onClick={()=>{this.newbubblecolour='rgb(180,240,200)';this.forceUpdate()}} style={{color:'black',borderColor:'white',backgroundColor:'rgb(180,240,200)'}}>Green</button>
					<button onClick={()=>{this.newbubblecolour='rgb(250,250,190)';this.forceUpdate()}} style={{color:'black',borderColor:'white',backgroundColor:'rgb(250,250,190)'}}>Yellow</button>
					<button onClick={()=>{this.newbubblecolour='rgb(240,190,250)';this.forceUpdate()}} style={{color:'black',borderColor:'white',backgroundColor:'rgb(240,190,250)'}}>Purple</button>
					<p/>
					<svg width={this.schedulerDimensions[0]} height={this.schedulerDimensions[1]}>
						{Columns([0,0],this.schedulerDimensions,this.displaycols,[5,15],20)}
						{this.bubbles.map((b)=>b.render())})	
					</svg>
				</div>
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
