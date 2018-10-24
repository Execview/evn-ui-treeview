import React, { Component } from 'react';
import '../css/App.css';
var Rx = require('rxjs/Rx')
var moment = require('moment')

var crypto = require('crypto')
const hash = crypto.createHash('sha256');

//TODO ADD RIGHTCLICK MENU TO RENAME, DELETE, AND CHANGE BUBBLE COLOUR. Figure out how selective loading is going to work. remember links not on screen still exist! If you make it a property of the bubble, it would work, then climb tree of visible bubbles to find parent, before recursively forcing links down the tree. Also make bubble "key" a string or something generic, then you can use a SHA1 hash upon creation to guarentee uniqueness
var mousepositionstream = Rx.Observable.fromEvent(document,'mousemove')

class Scheduler extends Component {
	constructor()
	{
		//these should be ALL props.
		super();
		this.svgRef = React.createRef();
		mousepositionstream.subscribe((event)=>this.mousemove(event))

		this.selectedFile = 'a.json'
		this.schedulerPageScale = [0.9,1]
		this.internalSVGDimensions = [1280,1000]

		this.colours = [['Blue','rgb(190,230,240)'],['Red','rgb(240,180,190)'],['Green','rgb(180,240,200)'],['Yellow','rgb(250,250,190)'],['Purple','rgb(240,190,250)']]
		this.newbubblecolour = this.colours[0][1]
		this.highlightcolour = 'rgb(100,100,100)'		
		this.bubbleDimensions = [[1,"days"],50]

		this.startdate = new Date("2018-08-27")
		this.enddate = new Date("2018-09-06")//"2018-09-02"

		var daterange = this.getDateRange(this.startdate,this.enddate)

		//snaps = [[x_id,x_x],[y_id,y_y]]
		this.state = {bubbles: {}, links: [], displaycols: daterange, snaps: [[],[]]}

		for(var i=0;i<daterange.length;i++){this.state.snaps[0].push([daterange[i],(this.internalSVGDimensions[0]/daterange.length)*i])}
		this.state.snaps[0].push([moment(daterange[-1]).add(this.bubbleDimensions[0]).toDate(),this.internalSVGDimensions[0]/daterange.length*daterange.length]) //Add one more snap at the end

		for(var j=0;this.bubbleDimensions[1]*j<this.internalSVGDimensions[1];j++){this.state.snaps[1].push([j,this.bubbleDimensions[1]*j])}

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
		this.getNearestDateToX = this.getNearestDateToX.bind(this);
		this.getInternalMousePosition = this.getInternalMousePosition.bind(this);
		this.bubbleCopy = this.bubbleCopy.bind(this);
		this.bubbleDateParser = this.bubbleDateParser.bind(this);
		// #endregion
	}

// #region Scheduler Rules 
	bubbleTransform(key,changes){
		var originalStates = {}; //save a copy of the original states and replace the current state with the original if the current is an illegal state after the transformations
		for (var bubblekey in this.state.bubbles){var bubble=this.state.bubbles[bubblekey];originalStates[bubble.key]=this.bubbleCopy(bubble)}
		Object.assign(this.state.bubbles[key],changes)
		if(!this.checkIfValidTransformState(this.state)){this.state.bubbles={};for (var bubblekey in originalStates){var bubble=originalStates[bubblekey];this.state.bubbles[bubble.key]=this.bubbleCopy(bubble)}}
		this.forceUpdate()
	}

	checkIfValidTransformState(teststate) 
	{	
		//Move all bubbles based on links
		const horribleLinkForcingAlgorithm = () =>{
			var changes = false
			this.state.links.forEach(link=>{
				var parentside = 'right'===link[1] ? "enddate" : "startdate"
				var childside = 'right'===link[3] ? "enddate" : "startdate"
				var xGapx =link[4]
				if(!moment(teststate.bubbles[link[0]][parentside]).add(xGapx).isSame(moment(teststate.bubbles[link[2]][childside]))){
					var childotherside = 'right'===link[3] ? "startdate" : "enddate";
					var childwidth = (teststate.bubbles[link[2]][childotherside]-teststate.bubbles[link[2]][childside]);
					teststate.bubbles[link[2]][childside]=moment(teststate.bubbles[link[0]][parentside]).add(xGapx).toDate();
					teststate.bubbles[link[2]][childotherside]=moment(teststate.bubbles[link[2]][childside]).add(childwidth).toDate();
					changes=true}}) 
			if(changes===true){horribleLinkForcingAlgorithm()}
		}
		horribleLinkForcingAlgorithm()
		
		//Dont allow negative length bubbles
		if(!Object.keys(teststate.bubbles).every(bubblekey => {var bubble = teststate.bubbles[bubblekey];return bubble.startdate<bubble.enddate})){console.log('negative width!');return false}
		
		//Dont allow bubbles to collide
		if(!Object.keys(teststate.bubbles).every(bubblekey => {var bubble = teststate.bubbles[bubblekey];return this.checkForNoBubbleCollisions(bubble,teststate)})){console.log('collision!');return false}

		return true
	}

	checkForNoBubbleCollisions(bubble,teststate)
	{
		var bubbleswithoutthis = {}
		for (var bubblekey in teststate.bubbles){var b=teststate.bubbles[bubblekey];bubbleswithoutthis[b.key]=this.bubbleCopy(b)}
		delete bubbleswithoutthis[bubble.key]
		return Object.keys(bubbleswithoutthis).every((otherBubbleKey)=>{var otherBubble = bubbleswithoutthis[otherBubbleKey]
			return !((this.FLOATcloseenough(otherBubble.y,
			bubble.y)) && 
			(	(bubble.startdate>otherBubble.startdate
				&&
				bubble.startdate<otherBubble.enddate)
			||
				(bubble.enddate>otherBubble.startdate
				&&
				bubble.enddate<otherBubble.enddate)
			||
				(bubble.startdate<=otherBubble.startdate
				&&
				bubble.enddate>=otherBubble.enddate)
			)			
			)
		})
	}

	performLink(liftkey,liftside){
		if(this.lastup!==null)
		{
			var upkey=this.lastup[0];
			var upside=this.lastup[1];
			var liftpoint = 'right'===liftside ? "enddate" : "startdate"
			var uppoint = 'right'===upside ? "enddate" : "startdate"			
			if(this.state.links.every(link=>{return (link[2]!==upkey)&&!(link[0]===upkey&&link[2]===liftkey)}) && upkey!==liftkey){
				var xGapDate = this.state.bubbles[upkey][uppoint]-this.state.bubbles[liftkey][liftpoint]; //Date vector from the parent bubble to the child bubble
				this.state.links.push([liftkey,liftside,upkey,upside,xGapDate])
				console.log(liftkey+' '+liftside+' '+upkey+' '+upside+' '+xGapDate)
				console.log(this.state.links)
				this.setOriginalColour(upkey,upside)
				this.forceUpdate() //Sometimes it wasnt updating the colour until next mouse event. This forces it here.
			}
			else{console.log('already linked!')}
		}
		this.lastup = null
		}
// #endregion

// #region Scheduler Functionality
	makeNewBubble()
	{
		var maxY = this.state.snaps[1][0][1]
		var maxX = this.startdate
		for (var bubblekey in this.state.bubbles){var bubble=this.state.bubbles[bubblekey];	
												if(bubble.y>maxY){maxY=bubble.y};
											  	if(bubble.enddate>maxX){maxX=bubble.enddate}}
												  
		var newbubble = {key:hash.update(Date.now()).digest('hex'), startdate:maxX, enddate:moment(maxX).add(...this.bubbleDimensions[0]).toDate(), y:maxY+this.bubbleDimensions[1], colour:this.newbubblecolour,leftcolour:this.newbubblecolour,rightcolour:this.newbubblecolour, highlightcolour: this.highlightcolour, mouseDownOn: [false,false,false], dragDiffs: [[0,0],[0,0]], text: ''}
		this.state.bubbles[newbubble.key] = newbubble
		this.forceUpdate();
		console.log(this.state.bubbles)
		console.log(newbubble.key)
	}

	saveToFile(){
		console.log("Saving to: "+this.selectedFile)
		var bubbleData = {}
		for (var bubblekey in this.state.bubbles){var bubble=this.state.bubbles[bubblekey];
			const {highlightcolour, leftcolour, rightcolour, mouseDownOn, dragDiffs, ...rest} = bubble
			bubbleData[bubble.key]=rest}
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
			.then(data => {	this.state.links = data.links
							this.state.bubbles = {}
							for (var bubblekey in data.bubbles){ var bubble = data.bubbles[bubblekey] 
								this.state.bubbles[bubble.key]={key:bubble.key, startdate:new Date(bubble.startdate), enddate:new Date(bubble.enddate), y: bubble.y, colour:bubble.colour, leftcolour:bubble.colour, rightcolour:bubble.colour, highlightcolour: this.highlightcolour, mouseDownOn: [false,false,false], dragDiffs: [[0,0],[0,0]], text: bubble.text || ''}};
							console.log(this.state)
							for (var bubblekey in this.state.bubbles){var bubble=this.state.bubbles[bubblekey];this.setOriginalColour(bubble.key,'left');this.setOriginalColour(bubble.key,'right')}	
							this.forceUpdate()
							})
					}
// #endregion

// #region Bubble Rules 
	leftclickdown(key,event){this.state.bubbles[key].mouseDownOn[0] = true; this.setHighlightColour(key,'left'); this.forceUpdate()}
	rightclickdown(key,event){this.state.bubbles[key].mouseDownOn[1] = true; this.setHighlightColour(key,'right'); this.forceUpdate()}
	middleclickdown(key,event){this.state.bubbles[key].mouseDownOn[2] = true;
							 this.state.bubbles[key].mousedownpos = this.getInternalMousePosition(event)
							if(event.buttons===2){console.log('right click!')}
							this.state.bubbles[key].dragDiffs[0] = [this.state.bubbles[key].mousedownpos[0]-this.getNearestSnapXToDate(this.state.bubbles[key].startdate),
																	this.state.bubbles[key].mousedownpos[1]-this.state.bubbles[key].y]
							this.state.bubbles[key].dragDiffs[1] = [this.state.bubbles[key].mousedownpos[0]-this.getNearestSnapXToDate(this.state.bubbles[key].enddate),
																	this.state.bubbles[key].mousedownpos[1]-(this.state.bubbles[key].y+this.bubbleDimensions[1])]}
	leftclickup(key,event){this.lastup=[key,'left']}
	rightclickup(key,event){this.lastup=[key,'right']}
	leftmousein(key,event){if(event.buttons!==0 && !this.state.bubbles[key].mouseDownOn[2]){this.setHighlightColour(key,'left');this.forceUpdate()}}
	leftmouseout(key,event){if(!this.state.bubbles[key].mouseDownOn[0] && event.buttons!==0){this.setOriginalColour(key,'left');this.forceUpdate()}}
	rightmousein(key,event){if(event.buttons!==0 && !this.state.bubbles[key].mouseDownOn[2]){this.setHighlightColour(key,'right');this.forceUpdate()}}
	rightmouseout(key,event){if(!this.state.bubbles[key].mouseDownOn[1] && event.buttons!==0){this.setOriginalColour(key,'right');this.forceUpdate()}}

	leftlift(key){this.performLink(key,'left')}
	rightlift(key){this.performLink(key,'right')}

	mousemove(event)
	{
		var mouse = this.getInternalMousePosition(event)
		for (var bubblekey in this.state.bubbles){var bubble=this.state.bubbles[bubblekey];
		if(event.buttons===0) {	if(bubble.mouseDownOn[0]){this.leftlift(bubble.key)};
								if(bubble.mouseDownOn[1]){this.rightlift(bubble.key)};
								bubble.mouseDownOn[0]=false;	bubble.mouseDownOn[1]=false; bubble.mouseDownOn[2]=false;
								if(bubble.leftcolour===this.highlightcolour || bubble.rightcolour===this.highlightcolour){
									this.setOriginalColour(bubble.key,'left')
									this.setOriginalColour(bubble.key,'right')
									this.forceUpdate()}}
		if(bubble.mouseDownOn[0] && !event.shiftKey){this.bubbleTransform(bubble.key,{startdate: this.getNearestDateToX(mouse[0])})}
		if(bubble.mouseDownOn[1] && !event.shiftKey){this.bubbleTransform(bubble.key,{enddate:this.getNearestDateToX(mouse[0])})}
		if(bubble.mouseDownOn[2]){ var newstartdate = this.getNearestDateToX(mouse[0]-bubble.dragDiffs[0][0])
			this.bubbleTransform(bubble.key,{startdate: newstartdate, 
											enddate:	moment(newstartdate).add(bubble.enddate-moment(bubble.startdate)).toDate(),
											y: 			this.getNearestValueInArray(this.state.snaps[1].map(i=>i[1]),mouse[1]-this.bubbleDimensions[1]/2)})}
		}
	}

	setOriginalColour(key,side){
		var colourtoset=this.state.bubbles[key].colour
		this.state.links.forEach(link=>{
		if(parseInt(link[2])===key &&link[3]===side){colourtoset = this.state.bubbles[link[0]].colour}})
		if(side==='right'){this.state.bubbles[key] = Object.assign(this.state.bubbles[key],{rightcolour:colourtoset})}else{this.state.bubbles[key] = Object.assign(this.state.bubbles[key],{leftcolour:colourtoset})}
	}
	setHighlightColour(key,side){
		var colourtoset=this.highlightcolour
		if(side ==='right'){this.state.bubbles[key] = Object.assign(this.state.bubbles[key],{rightcolour:colourtoset})}else{this.state.bubbles[key] = Object.assign(this.state.bubbles[key],{leftcolour:colourtoset})}
	}

// #endregion

  	render() {
		console.log("render scheduler")
		var BubbleElements = []
		for (var bubblekey in this.state.bubbles){var b = this.state.bubbles[bubblekey];
		BubbleElements.push(Bubble([this.getNearestSnapXToDate(b.startdate),b.y],[this.getNearestSnapXToDate(b.enddate),b.y+this.bubbleDimensions[1]],b.colour,this.leftclickdown,this.rightclickdown,this.middleclickdown,this.leftclickup,this.rightclickup,this.leftmousein,this.leftmouseout,this.rightmousein,this.rightmouseout,b.leftcolour,b.rightcolour,b.key,b.text))}
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
					<svg onContextMenu={(event)=>{event.preventDefault()}} ref={this.svgRef} viewBox={'0 0 '+this.internalSVGDimensions[0]+' '+ this.internalSVGDimensions[1]} transform={'scale('+this.schedulerPageScale[0]+','+this.schedulerPageScale[1]+')'}>
						{Columns([0,0],this.internalSVGDimensions,this.state.snaps,[5,15],20)}
						{BubbleElements}
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
	getInternalMousePosition(event){
		var mouse = document.querySelector("svg").createSVGPoint();
		mouse.x =event.clientX
		mouse.y = event.clientY
		var mouseSVG = mouse.matrixTransform(this.svgRef.current.getScreenCTM().inverse())
		return [mouseSVG.x,mouseSVG.y]
	}
	getDateRange(start, end){
		var daterange = []
		for(var currentdate=moment(start); currentdate.isSameOrBefore(end); currentdate.add(1,'d')){daterange.push(moment(currentdate).toDate())}
		return daterange
	}
	getNearestDateToX(X){
		var nearestsnap = this.getNearestValueInArray(this.state.snaps[0].map(i=>i[1]),X)
		var nearestsnapindex = this.state.snaps[0].map(i=>i[1]).indexOf(nearestsnap)
		return this.state.snaps[0][nearestsnapindex][0]
	}
	getNearestSnapXToDate(date){
		var daterangems = this.state.snaps[0].map(dateX=>dateX[0].valueOf())
		var nearestms = this.getNearestValueInArray(daterangems,date.valueOf())
		var nearestmsindex = daterangems.indexOf(nearestms)
		var nearestXsnap = this.state.snaps[0].map(i=>i[1])[nearestmsindex]
		return nearestXsnap //if you add extra snaps apart from the dates, this will break! check for nearest ms to a snap's date. Also make sure the bubbles loaded are in the bounds
	}
	bubbleCopy(bubble){
		return JSON.parse(JSON.stringify(bubble),this.bubbleDateParser)
	}
	bubbleDateParser(property,value){
		//2018-08-29T00:00:00.000Z example case of date
		var dateCheck = new RegExp("\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}:\\d{2}\\.\\d{3}Z")
		if(dateCheck.test(value)){return new Date(value)} //return a date if it is a date else return the original item		
		return value
	}

// #endregion
}

function Columns(startpoint, endpoint, snaps,colLetterShift=[5,10], horizontalBreakLineHeight=15)
	{	//TODO change input to accept titles and cell positions
		var columnTitles = snaps[0].map(dateX=>{return dateX[0].getDate()+"/"+dateX[0].getMonth()})
		var dayElements = []
		var dayBreakLines = []

		for(var i=0; i<columnTitles.length; i++){
			var xpos = snaps[0][i][1];
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
				leftcolour=colour, rightcolour=colour, key=null, text='') 
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
			<text x={(startpoint[0]+endpoint[0])/2} y={(startpoint[1]+endpoint[1])/2} textAnchor='middle'>{text}</text>
			</g>
	}

export default Scheduler;
