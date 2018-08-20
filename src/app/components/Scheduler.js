import React, { Component } from 'react';
import '../css/App.css';
import EventBubble from './EventBubble'
var Rx = require('rxjs/Rx')

class Scheduler extends Component {
	constructor()
	{
		//these should be ALL props. inc the date span. Also TODO convert (x,y) into dates when loading/saving/converting
		super();

		this.colours = [['Blue','rgb(190,230,240)'],['Red','rgb(240,180,190)'],['Green','rgb(180,240,200)'],['Yellow','rgb(250,250,190)'],['Purple','rgb(240,190,250)']]
		this.newbubblecolour = this.colours[0][1]
		this.highlightcolour = 'rgb(100,100,100)'

		var week = ['Mo','Tu','We','Th','Fr','Sa','Su']
		var month = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26,27,28,29,30,31]
		var year = ['Ja','Fe','Ma','Ap','Ma','Ju','JL','Au','Se','Oc','No','De']
		var names = ["James","Andras","Salman","Marisha","Vygantus"]

		this.selectedFile = 'a.json'

		this.rows = names
		var initialbubbles=[]

		this.state = {bubbles: initialbubbles, links: [], displaycols: week, snaps: [[],[]]} // TODO PUT STATE HERE
		
		this.schedulerDimensions = [window.innerWidth*0.85,700]
		this.bubbleDimensions = [this.schedulerDimensions[0]/this.state.displaycols.length,50]

		for(var i=0;i<2*this.state.displaycols.length+1;i++){this.state.snaps[0].push(this.bubbleDimensions[0]*i)}
		for(var j=0;this.bubbleDimensions[1]*j<this.schedulerDimensions[1];j++){this.state.snaps[1].push(this.bubbleDimensions[1]*j)}

		this.bubblemessagestream = new Rx.Subject();
		this.bubblemessagestream.subscribe(	(message)=>{if(message[0]==='transform'){this.bubbleTransform(message[1],message[2])}
														else if(message[0]==='linkup'){this.lastup=[message[1],message[2]]}
														else if(message[0]==='linklift'){console.log('lift');this.performLink(message[1],message[2])}
														else if(message[0]==='originalcolour'){this.setOriginalColour(message[1],message[2])}
														else if(message[0]==='highlightcolour'){this.setHighlightColour(message[1],message[2])}
														})

		this.lastup = null		
		this.bubbleTransform = this.bubbleTransform.bind(this);
		this.checkIfValidTransformState = this.checkIfValidTransformState.bind(this);
		this.noCollisions = this.noCollisions.bind(this);
		this.checkForNoBubbleCollisions = this.checkForNoBubbleCollisions.bind(this);
		this.getNearestValueInArray = this.getNearestValueInArray.bind(this);
		this.performLink = this.performLink.bind(this);
		this.setOriginalColour = this.setOriginalColour.bind(this);
		this.setHighlightColour = this.setHighlightColour.bind(this);
		this.makeNewBubble = this.makeNewBubble.bind(this);
		this.saveToFile = this.saveToFile.bind(this);
		this.loadFromFile = this.loadFromFile.bind(this);			
		this.render = this.render.bind(this);
	}

	bubbleTransform(key,changes){
		var originalStates = []; //save a copy of the original states and replace the current state with the original if the current is an illegal state after the transformations
		this.state.bubbles.forEach(bubble=>{originalStates.push(JSON.parse(JSON.stringify(bubble.state)))})
		Object.assign(this.state.bubbles[key].state,changes)
		if(!this.checkIfValidTransformState(this.state)){var i=0;this.state.bubbles.forEach(bubble=>{bubble.state=originalStates[i];i++});}
		this.forceUpdate()	
	}

	checkIfValidTransformState(teststate) 
	{	
		//Move all bubbles based on links
		const horribleLinkForcingAlgorithm = () =>{
			var changes = false
			this.state.links.forEach(link=>{
			var parentside = 'right'===link[1] ? "endpoint" : "startpoint"
			var childside = 'right'===link[3] ? "endpoint" : "startpoint"
			if(teststate.bubbles[link[0]].state[parentside][0]!==teststate.bubbles[link[2]].state[childside][0]){
				var childotherside = 'right'===link[3] ? "startpoint" : "endpoint";
				teststate.bubbles[link[2]].state[childotherside][0]+=teststate.bubbles[link[0]].state[parentside][0]-teststate.bubbles[link[2]].state[childside][0]
				teststate.bubbles[link[2]].state[childside][0]=teststate.bubbles[link[0]].state[parentside][0];
				changes=true}})
			if(changes===true){horribleLinkForcingAlgorithm()}
		}
		horribleLinkForcingAlgorithm()

		//Snap all bubbles
		teststate.bubbles.forEach(bubble=>{
			bubble.state.startpoint = [	this.getNearestValueInArray(this.state.snaps[0],bubble.state.startpoint[0]),
										this.getNearestValueInArray(this.state.snaps[1],bubble.state.startpoint[1])]
			bubble.state.endpoint = [	this.getNearestValueInArray(this.state.snaps[0],bubble.state.endpoint[0]),
										this.getNearestValueInArray(this.state.snaps[1],bubble.state.endpoint[1])]})		
		
		//Dont allow negative length bubbles	
		var oneHasNegativeWidth = false
		teststate.bubbles.forEach(bubble => {if(bubble.state.startpoint[0]>=bubble.state.endpoint[0]){oneHasNegativeWidth = true}});
		if(oneHasNegativeWidth){return false}
		
		//Dont allow bubbles to collide
		if(!this.noCollisions(teststate)){return false}

		return true
	}


	noCollisions(teststate){
		var noglobalcollision = true
		teststate.bubbles.forEach(bubble=>{if(!this.checkForNoBubbleCollisions(bubble,teststate)){noglobalcollision=false}})
		return noglobalcollision
	}

	checkForNoBubbleCollisions(bubble,teststate)
	{
		var bubbleswithoutthis = teststate.bubbles.slice()
		bubbleswithoutthis.splice(bubble.props.key,1)
		var nocollision = true
		bubbleswithoutthis.forEach((otherBubble)=>{
			if((otherBubble.state.startpoint[1]===bubble.state.startpoint[1]) && 
			(	(bubble.state.startpoint[0]>otherBubble.state.startpoint[0]
				&&
				bubble.state.startpoint[0]<otherBubble.state.endpoint[0])
			||
				(bubble.state.endpoint[0]>otherBubble.state.startpoint[0]
				&&
				bubble.state.endpoint[0]<otherBubble.state.endpoint[0])
			||
				(bubble.state.startpoint[0]<=otherBubble.state.startpoint[0] 
				&&
				bubble.state.endpoint[0]>=otherBubble.state.endpoint[0])
			)			
			){nocollision=false;console.log('collision')}
		})
		return nocollision
	}

	getNearestValueInArray(snapsarray,value){ if(snapsarray===[]){return value}
		var distancefromsnapsarray = snapsarray.slice().map((i)=>Math.abs(i-value))
		return snapsarray[distancefromsnapsarray.indexOf(Math.min(...distancefromsnapsarray))]
	}
	performLink(liftkey,liftside){
		if(this.lastup!==null)
		{
			var upkey=this.lastup[0];
			var upside=this.lastup[1];		
			if(this.state.links.every(link=>{return (link[2]!==upkey)&&!(link[0]===upkey&&link[2]===liftkey)}) && upkey!==liftkey){
				this.state.links.push([liftkey,liftside,upkey,upside])
				console.log(liftkey+' '+liftside+' '+upkey+' '+upside)
				console.log(this.state.links)
				this.setOriginalColour(upkey,upside) //Sometimes it wasnt updating the colour until next mouse event. This forces it here.
			}
			else{console.log('already linked!')}
		}
		this.lastup = null
		}
	setOriginalColour(key,side){
		var colourtoset=this.state.bubbles[key].props.colour
		this.state.links.forEach(link=>{
		if(parseInt(link[2])===key &&link[3]===side){colourtoset = this.state.bubbles[link[0]].props.colour}})
		if(side==='right'){this.state.bubbles[key].state = Object.assign(this.state.bubbles[key].state,{rightcolour:colourtoset})}else{this.state.bubbles[key].state = Object.assign(this.state.bubbles[key].state,{leftcolour:colourtoset})}
		this.forceUpdate()
	}
	setHighlightColour(key,side){
		var colourtoset=this.state.bubbles[key].props.highlightcolour
		if(side==='right'){this.state.bubbles[key].state = Object.assign(this.state.bubbles[key].state,{rightcolour:colourtoset})}else{this.state.bubbles[key].state = Object.assign(this.state.bubbles[key].state,{leftcolour:colourtoset})}
		this.forceUpdate()
	}
	makeNewBubble()
	{
		var maxY = this.state.snaps[1][0]
		var maxX = 0
		var maxkey = -1
		this.state.bubbles.forEach((bubble)=>{if(bubble.state.startpoint[1]>maxY){maxY=bubble.state.startpoint[1]};
										if(bubble.state.endpoint[0]>maxX){maxX=bubble.state.endpoint[0]};
										if(bubble.props.key>maxkey){maxkey=bubble.props.key}})
		var newbubble = new EventBubble({key:maxkey+1, startpoint:[maxX,maxY+this.bubbleDimensions[1]], endpoint:[maxX+this.bubbleDimensions[0],maxY+2*this.bubbleDimensions[1]], colour:this.newbubblecolour,leftcolour:this.newbubblecolour,rightcolour:this.newbubblecolour, bubblemessagestream: this.bubblemessagestream, highlightcolour: this.highlightcolour})
		this.state.bubbles[newbubble.props.key] = newbubble
		this.forceUpdate();
	}

	saveToFile(){
		console.log("Saving to: "+this.selectedFile)
		var bubbleData = []
		this.state.bubbles.forEach(bubble=>{bubbleData.push({key:bubble.props.key,state:bubble.state})})
		var data = {links: this.state.links, bubbles: bubbleData}
		console.log(data)
		var url = "http://192.168.1.115:3001/write?file="+this.selectedFile+'&data='+JSON.stringify(data)
		fetch(url,{method: 'POST',header: {"Access-Control-Allow-Origin": "*", "Content-Type":"application/json"}})
			.then(response => {console.log("done")})}

	loadFromFile(){
		console.log("Loading: "+this.selectedFile)
		var url = "http://192.168.1.115:3001/read?file="+this.selectedFile
		fetch(url,{header: {"Access-Control-Allow-Origin": "*", "Content-Type":"application/json"}})
			.then(response => {return response.json()})
			.then(data => {	console.log(data)
							this.state.links = data.links
							this.state.bubbles = []
							data.bubbles.forEach(bubble=>{this.state.bubbles.push(new EventBubble({key:bubble.key, startpoint:bubble.state.startpoint, endpoint:bubble.state.endpoint, colour:bubble.state.colour, leftcolour:bubble.state.leftcolour, rightcolour:bubble.state.rightcolour, bubblemessagestream: this.bubblemessagestream, highlightcolour: this.highlightcolour}))});this.forceUpdate()})
					}

  	render() {
		console.log("render scheduler")
		return 	<div>
					<div className='App-dropdown'>
						<select onChange={(event)=>{this.selectedFile=event.target.value}}>
							<option value="a.json">a</option>
							<option value="b.json">b</option>
							<option value="c.json">c</option>
						</select>
						<button onClick={this.loadFromFile}>Load</button>
						<button onClick={this.saveToFile}>Save</button>
					</div>
					{/*Maybe add colour wheel. Also probably make another js file with these colours, so you can access them from multiple places.*/}
					<button style={{color:'black',borderColor:'black',backgroundColor:this.newbubblecolour}}>ACTIVE COLOUR </button>
					<button onClick={this.makeNewBubble}>Add bubble</button>
					{this.colours.map(colour=><button key={colour} onClick={()=>{this.newbubblecolour=colour[1];this.forceUpdate()}} style={{color:'black',borderColor:'white',backgroundColor: colour[1]}}>{colour[0]}</button>)}
					<p/>
					<svg width={this.schedulerDimensions[0]} height={this.schedulerDimensions[1]}>
						{Columns([0,0],this.schedulerDimensions,this.state.displaycols,[5,15],20)}
						{this.state.bubbles.map((b)=>b.render())})	
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
