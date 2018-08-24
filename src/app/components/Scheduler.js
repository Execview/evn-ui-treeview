import React, { Component } from 'react';
import '../css/App.css';
var Rx = require('rxjs/Rx')

var mousepositionstream = Rx.Observable.fromEvent(document,'mousemove')

class Scheduler extends Component {
	constructor()
	{
		//these should be ALL props. inc the date span. Also TODO convert (x,y) into dates when loading/saving/converting
		super();

		mousepositionstream.subscribe((event)=>this.mousemove(event))

		this.svgRef = React.createRef();

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
		
		this.schedulerPageScale = [0.9,1]
		this.internalSVGDimensions = [1280,1000]
		
		this.bubbleDimensions = [this.internalSVGDimensions[0]/this.state.displaycols.length,50]

		for(var i=0;i<2*this.state.displaycols.length+1;i++){this.state.snaps[0].push(this.bubbleDimensions[0]*i)}
		for(var j=0;this.bubbleDimensions[1]*j<this.internalSVGDimensions[1];j++){this.state.snaps[1].push(this.bubbleDimensions[1]*j)}

		this.lastup = null	

		// #region Contructor Function Binds
		this.bubbleTransform = this.bubbleTransform.bind(this);
		this.checkIfValidTransformState = this.checkIfValidTransformState.bind(this);
		this.checkForNoBubbleCollisions = this.checkForNoBubbleCollisions.bind(this);
		this.performLink = this.performLink.bind(this);		
		this.makeNewBubble = this.makeNewBubble.bind(this);
		this.saveToFile = this.saveToFile.bind(this);
		this.loadFromFile = this.loadFromFile.bind(this);	
		this.leftclickdown = this.leftclickdown.bind(this);
		this.rightclickdown = this.rightclickdown.bind(this);
		this.middleclickdown = this.middleclickdown.bind(this);
		this.leftclickup = this.leftclickup.bind(this);
		this.rightclickup = this.rightclickup.bind(this)
		this.leftmousein = this.leftmousein.bind(this);
		this.leftmouseout = this.leftmouseout.bind(this);
		this.rightmousein = this.rightmousein.bind(this);
		this.rightmouseout = this.rightmouseout.bind(this);
		this.leftlift = this.leftlift.bind(this);
		this.rightlift = this.rightlift.bind(this);
		this.mousemove = this.mousemove.bind(this);				
		this.setOriginalColour = this.setOriginalColour.bind(this);
		this.setHighlightColour = this.setHighlightColour.bind(this);				
		this.render = this.render.bind(this);
		this.FLOATcloseenough = this.FLOATcloseenough.bind(this);
		this.getNearestValueInArray = this.getNearestValueInArray.bind(this);
		this.getInternalMousePosition = this.getInternalMousePosition.bind(this)
		// #endregion
	}

// #region Scheduler Rules 
	bubbleTransform(key,changes){
		var originalStates = []; //save a copy of the original states and replace the current state with the original if the current is an illegal state after the transformations
		this.state.bubbles.forEach(bubble=>{originalStates.push(JSON.parse(JSON.stringify(bubble)))})
		Object.assign(this.state.bubbles[key],changes)
		if(!this.checkIfValidTransformState(this.state)){this.state.bubbles = []; originalStates.forEach(bubble=>this.state.bubbles.push(bubble))}
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
				if(!this.FLOATcloseenough(teststate.bubbles[link[0]][parentside][0]+link[4],teststate.bubbles[link[2]][childside][0])){
					var childotherside = 'right'===link[3] ? "startpoint" : "endpoint";
					var childwidth = (teststate.bubbles[link[2]][childotherside][0]-teststate.bubbles[link[2]][childside][0]);
					teststate.bubbles[link[2]][childside][0]=teststate.bubbles[link[0]][parentside][0]+link[4];
					teststate.bubbles[link[2]][childotherside][0]=teststate.bubbles[link[2]][childside][0]+childwidth
					changes=true}}) 
			if(changes===true){horribleLinkForcingAlgorithm()}
		}
		horribleLinkForcingAlgorithm()

		//Snap all bubbles
		teststate.bubbles.forEach(bubble=>{
			bubble.startpoint=[	this.getNearestValueInArray(this.state.snaps[0],bubble.startpoint[0]),
								this.getNearestValueInArray(this.state.snaps[1],bubble.startpoint[1])]
			bubble.endpoint = [	this.getNearestValueInArray(this.state.snaps[0],bubble.endpoint[0]),
								this.getNearestValueInArray(this.state.snaps[1],bubble.endpoint[1])]})		
		
		//Dont allow negative length bubbles
		if(!teststate.bubbles.every(bubble => {return (bubble.startpoint[0]+50)<bubble.endpoint[0]})){console.log('negative width!');return false}
		
		//Dont allow bubbles to collide
		if(!teststate.bubbles.every(bubble=>{return this.checkForNoBubbleCollisions(bubble,teststate)})){console.log('collision!');return false}

		return true
	}

	checkForNoBubbleCollisions(bubble,teststate)
	{
		var bubbleswithoutthis = teststate.bubbles.slice()
		bubbleswithoutthis.splice(bubble.key,1)
		return bubbleswithoutthis.every((otherBubble)=>{
			return !((this.FLOATcloseenough(otherBubble.startpoint[1],bubble.startpoint[1])) && 
			(	(bubble.startpoint[0]>otherBubble.startpoint[0]
				&&
				bubble.startpoint[0]<otherBubble.endpoint[0])
			||
				(bubble.endpoint[0]>otherBubble.startpoint[0]
				&&
				bubble.endpoint[0]<otherBubble.endpoint[0])
			||
				(bubble.startpoint[0]<=otherBubble.startpoint[0] 
				&&
				bubble.endpoint[0]>=otherBubble.endpoint[0])
			)			
			)
		})
	}

	performLink(liftkey,liftside){
		if(this.lastup!==null)
		{
			var upkey=this.lastup[0];
			var upside=this.lastup[1];
			var liftpoint = 'right'===liftside ? "endpoint" : "startpoint"
			var uppoint = 'right'===upside ? "endpoint" : "startpoint"			
			var xGap = this.state.bubbles[upkey][uppoint][0]-this.state.bubbles[liftkey][liftpoint][0]; //X vector from the parent bubble to the child bubble
			if(this.state.links.every(link=>{return (link[2]!==upkey)&&!(link[0]===upkey&&link[2]===liftkey)}) && upkey!==liftkey){
				this.state.links.push([liftkey,liftside,upkey,upside,xGap])
				console.log(liftkey+' '+liftside+' '+upkey+' '+upside+' '+xGap)
				console.log(this.state.links)
				this.setOriginalColour(upkey,upside) //Sometimes it wasnt updating the colour until next mouse event. This forces it here.
			}
			else{console.log('already linked!')}
		}
		this.lastup = null
		}
// #endregion

// #region Scheduler Functionality
	makeNewBubble()
	{
		var maxY = this.state.snaps[1][0]
		var maxX = 0
		var maxkey = -1
		this.state.bubbles.forEach((bubble)=>{if(bubble.startpoint[1]>maxY){maxY=bubble.startpoint[1]};
										if(bubble.endpoint[0]>maxX){maxX=bubble.endpoint[0]};
										if(bubble.key>maxkey){maxkey=bubble.key}})
		var newbubble = {key:maxkey+1, startpoint:[maxX,maxY+this.bubbleDimensions[1]], endpoint:[maxX+this.bubbleDimensions[0],maxY+2*this.bubbleDimensions[1]], colour:this.newbubblecolour,leftcolour:this.newbubblecolour,rightcolour:this.newbubblecolour, highlightcolour: this.highlightcolour, mouseDownOn: [false,false,false], dragDiffs: [[0,0],[0,0]]}
		this.state.bubbles[newbubble.key] = newbubble
		this.forceUpdate();
	}

	saveToFile(){
		console.log("Saving to: "+this.selectedFile)
		var bubbleData = []
		this.state.bubbles.forEach(bubble=>{bubbleData.push(bubble)})
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
							data.bubbles.forEach(bubble=>{this.state.bubbles.push({key:bubble.key, startpoint:bubble.startpoint, endpoint:bubble.endpoint, colour:bubble.colour, leftcolour:bubble.leftcolour, rightcolour:bubble.rightcolour, highlightcolour: this.highlightcolour, mouseDownOn: [false,false,false], dragDiffs: [[0,0],[0,0]]})});this.forceUpdate()})
					}
// #endregion

// #region Bubble Rules 

	

	leftclickdown(key,event){this.state.bubbles[key].mouseDownOn[0] = true; this.setHighlightColour(key,'left')}
	rightclickdown(key,event){this.state.bubbles[key].mouseDownOn[1] = true; this.setHighlightColour(key,'right')}
	middleclickdown(key,event){this.state.bubbles[key].mouseDownOn[2] = true;
							 this.state.bubbles[key].mousedownpos = this.getInternalMousePosition(event)
							 console.log(this.state.bubbles[key].mousedownpos)
							this.state.bubbles[key].dragDiffs[0] = [this.state.bubbles[key].mousedownpos[0]-this.state.bubbles[key].startpoint[0],
																	this.state.bubbles[key].mousedownpos[1]-this.state.bubbles[key].startpoint[1]]
							this.state.bubbles[key].dragDiffs[1] = [this.state.bubbles[key].mousedownpos[0]-this.state.bubbles[key].endpoint[0],
																	this.state.bubbles[key].mousedownpos[1]-this.state.bubbles[key].endpoint[1]]}
	leftclickup(key,event){this.lastup=[key,'left']}
	rightclickup(key,event){this.lastup=[key,'right']}
	leftmousein(key,event){if(event.buttons!==0){this.setHighlightColour(key,'left')}}
	leftmouseout(key,event){if(!this.state.bubbles[key].mouseDownOn[0] && event.buttons!==0){this.setOriginalColour(key,'left')}}
	rightmousein(key,event){if(event.buttons!==0){this.setHighlightColour(key,'right')}}
	rightmouseout(key,event){if(!this.state.bubbles[key].mouseDownOn[1] && event.buttons!==0){this.setOriginalColour(key,'right')}}

	leftlift(key){this.performLink(key,'left')}
	rightlift(key){this.performLink(key,'right')}

	mousemove(event)
	{
		var mouse = this.getInternalMousePosition(event)
		this.state.bubbles.forEach(bubble=>{
		if(event.buttons===0) {	if(bubble.mouseDownOn[0]){this.leftlift(bubble.key)};
								if(bubble.mouseDownOn[1]){this.rightlift(bubble.key)};
								bubble.mouseDownOn[0]=false;	bubble.mouseDownOn[1]=false; bubble.mouseDownOn[2]=false;
								if(bubble.leftcolour===this.highlightcolour || bubble.rightcolour===this.highlightcolour){
									this.setOriginalColour(bubble.key,'left')
									this.setOriginalColour(bubble.key,'right')}}
		if(bubble.mouseDownOn[0] && !event.shiftKey){this.bubbleTransform(bubble.key,{startpoint: [mouse[0],bubble.startpoint[1]]})}
		if(bubble.mouseDownOn[1] && !event.shiftKey){this.bubbleTransform(bubble.key,{endpoint:[mouse[0],bubble.endpoint[1]]})}
		if(bubble.mouseDownOn[2]){
			this.bubbleTransform(bubble.key,{startpoint:[mouse[0]-bubble.dragDiffs[0][0],
														mouse[1]-bubble.dragDiffs[0][1]], 
											endpoint:[	mouse[0]-bubble.dragDiffs[1][0],
														mouse[1]-bubble.dragDiffs[1][1]]})}
		})
	}

	setOriginalColour(key,side){
		var colourtoset=this.state.bubbles[key].colour
		this.state.links.forEach(link=>{
		if(parseInt(link[2])===key &&link[3]===side){colourtoset = this.state.bubbles[link[0]].colour}})
		if(side==='right'){this.state.bubbles[key] = Object.assign(this.state.bubbles[key],{rightcolour:colourtoset})}else{this.state.bubbles[key] = Object.assign(this.state.bubbles[key],{leftcolour:colourtoset})}
		this.forceUpdate()
	}
	setHighlightColour(key,side){
		var colourtoset=this.highlightcolour
		if(side ==='right'){this.state.bubbles[key] = Object.assign(this.state.bubbles[key],{rightcolour:colourtoset})}else{this.state.bubbles[key] = Object.assign(this.state.bubbles[key],{leftcolour:colourtoset})}
		this.forceUpdate()
	}

// #endregion

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
					<svg ref={this.svgRef} viewBox={'0 0 '+this.internalSVGDimensions[0]+' '+ this.internalSVGDimensions[1]} transform={'scale('+this.schedulerPageScale[0]+','+this.schedulerPageScale[1]+')'}>
						{Columns([0,0],this.internalSVGDimensions,this.state.displaycols,[5,15],20)}
						{this.state.bubbles.map((b)=>Bubble(b.startpoint,b.endpoint,b.colour,this.leftclickdown,this.rightclickdown,this.middleclickdown,this.leftclickup,this.rightclickup,this.leftmousein,this.leftmouseout,this.rightmousein,this.rightmouseout,b.leftcolour,b.rightcolour,b.key))}	
					</svg>
				</div>
	}
// #region Useful Functions
	FLOATcloseenough(a,b){
		return Math.round(100*a)===Math.round(100*b) //matches floats to 2 dp
	}
	getNearestValueInArray(snapsarray,value){ if(snapsarray===[]){return value}
		var distancefromsnapsarray = snapsarray.slice().map((i)=>Math.abs(i-value))
		return snapsarray[distancefromsnapsarray.indexOf(Math.min(...distancefromsnapsarray))]
	}
	getInternalMousePosition(event){//var svg = event.currentTarget.parentNode.parentNode;
		var mouse = document.querySelector("svg").createSVGPoint();
		mouse.x =event.clientX
		mouse.y = event.clientY
		var mouseSVG = mouse.matrixTransform(this.svgRef.current.getScreenCTM().inverse())
		return [mouseSVG.x,mouseSVG.y]
	}
// #endregion

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

function Bubble(startpoint, endpoint, colour='rgb(190,230,240)', 
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
			<path d={leftend} fill={leftcolour} strokeWidth='0' onMouseDown={(event)=>leftclickdown(key,event)} onMouseUp={(event)=>leftclickup(key,event)} onMouseEnter={(event)=>leftmousein(key,event)} onMouseOut={(event)=>leftmouseout(key,event)}/>
			<path d={middle} fill={colour} strokeWidth='0' onMouseDown={(event)=>middleclickdown(key,event)}/>
			<path d={rightend} fill={rightcolour} strokeWidth='0' onMouseDown={(event)=>rightclickdown(key,event)} onMouseUp={(event)=>rightclickup(key,event)} onMouseEnter={(event)=>rightmousein(key,event)} onMouseOut={(event)=>rightmouseout(key,event)}/> 
			</g>
	}


export default Scheduler;
