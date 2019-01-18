import React, { Component } from 'react';
import {connect} from 'react-redux'
import '../css/Scheduler.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Bubble from "./Bubble";
import Columns from "./Columns";
import BubbleContextMenu from "./BubbleContextMenu"
import RenameModal from "./RenameModal"
import { connectableObservableDescriptor } from 'rxjs/internal/observable/ConnectableObservable';
var Rx = require('rxjs/Rx')
var moment = require('moment')
var crypto = require('crypto')
const hash = crypto.createHash('sha256');

const SESSIONTOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjViYzUxNDgzZDE5MWQ4ODRhNDM1YmRkZSIsImVtYWlsIjoiZGVtb0BleGVjdmlldy5jb20ifQ.astgpmbCNcdwlOtEg83Bn6esS_PNnWkcVYN1JVLCdWw'

//TODO ADD DARK THEME CSS. MAYBE STRING APPEND A COLOUR OVERWRITING CLASS? CONSIDER WHERE CSS GOES ON A COMPONENT
//TODO LOAD ONLY BUBBLES WHICH ARE VISIBLE (+ the parent) FROM DB
//TODO MULTIPLE PARENTS SELECT LATEST/EARLIEST

//TODO Figure out how selective loading is going to work. remember links not on screen still exist!
// KNOWN BUG: loading a file with adjacent bubbles seems to require the LHS bubble to be moved back and forth before a RHS bubble is able to re-claim its place. Could just be corrupt data though...
var mousepositionstream = Rx.Observable.fromEvent(document,'mousemove').merge(Rx.Observable.fromEvent(document,'mousedown'))

class Scheduler extends Component {
	constructor()
	{
		//these should be ALL props.
		super();
		this.svgRef = React.createRef();
		mousepositionstream.subscribe((event)=>this.mouseEvent(event))

		this.selectedFile = 'a.json'
		this.schedulerPageScale = [0.9,1]
		this.internalSVGDimensions = [1280,1000]
		this.darkTheme = true

		this.startdate = new Date("2018-12-15")
		this.enddate = new Date("2018-12-22")
		this.extrasnaps = 2 //extra snaps beyond visible range. must be above 2+ to fit an entire bubble right and left side.

		this.Lightcolours = [	['Blue','rgb(190,230,240)'],
								['Red','rgb(240,180,190)'],
								['Green','rgb(180,240,200)'],
								['Yellow','rgb(250,250,190)'],
								['Purple','rgb(240,190,250)']]
		this.Darkcolours = [	['Blue','rgb(130,200,210)'],
								['Red','rgb(210,115,130)'],
								['Green','rgb(100,200,135)'],
								['Yellow','rgb(240,240,160)'],
								['Purple','rgb(220,160,230)']]

		this.colours = this.darkTheme?this.Darkcolours:this.Lightcolours
		this.AndrasToColour = {	AMBER:"Yellow",
								RED:"Red",
								GREEN:"Green",
								BLUE:"Blue",
								GREY:"Purple"}
		this.newbubblecolour = this.colours[0][1]
		this.highlightcolour = 'rgb(100,100,100)'		
		this.bubbleDimensions = [[1,"days"],50]

		this.state = {snaps: [[],[]]}
		//snaps = [[x_id,x_x],[y_id,y_y]]

		this.isOnScheduler = false //is mouse down on the scheduler
		this.activeBubbleContextMenu = ['',[0,0]] //which Bubble the context menu is open on and mouse co-ordinate
		this.activeRenameModal = '' //bubble key for the bubble which the rename modal will edit
		this.DownDateandSchedulerWidth = [0,new Date("1970-01-01")] //temporary variable needed when scrolling scheduler with mouse
	}
	componentDidMount = ()=>{
		this.setStartAndEndDate(this.startdate,this.enddate)
		this.setYSnaps()
	}
	setStartAndEndDate = (start,end)=>{
		//this.extrasnaps adds snapping points beyond the visible range. the columns are told not to render
		if(end-start<0){return}
		this.startdate = start
		this.enddate = end
		function getDateRange(start, end){
			var daterange = []
			for(var currentdate=moment(start); currentdate.isSameOrBefore(end); currentdate.add(1,'d')){
				daterange.push(moment(currentdate).toDate())
				}
			return daterange
		}
		var daterange = getDateRange(moment(this.startdate).subtract(this.extrasnaps,'d').toDate(),moment(this.enddate).add(this.extrasnaps,'d'));
		this.state.snaps[0]=[]
		for(var i=0;i<daterange.length;i++){
			this.state.snaps[0].push([daterange[i],(this.internalSVGDimensions[0]/(daterange.length-2*this.extrasnaps))*(i-this.extrasnaps)])
			}
		this.forceUpdate()
	}
	setYSnaps = ()=>{
		this.state.snaps[1] = []
		for(var j=1;this.bubbleDimensions[1]*j<this.internalSVGDimensions[1];j++){
			this.state.snaps[1].push([j,this.bubbleDimensions[1]*j])
			}
	}

	tryLinking = (childkey,childside)=>{
		for(var bubblekey in this.props.bubbles){			
			if(this.props.bubbles[bubblekey].mouseDownOn.left || this.props.bubbles[bubblekey].mouseDownOn.right)
			{
				var bubbleside = 'left'
				if(this.props.bubbles[bubblekey].mouseDownOn.right){bubbleside='right'}
				console.log([childkey,bubblekey,childside,bubbleside])
				this.props.performLink(childkey,bubblekey,childside,bubbleside)
				this.forceUpdate();
			}
		}
	}

	makeNewBubble = ()=>{
		var maxY = this.state.snaps[1][0][0]-1
		var maxX = this.startdate
		for (var bubblekey in this.props.bubbles){var bubble=this.props.bubbles[bubblekey];	
												if(bubble.y>maxY){maxY=bubble.y};
											  	if(bubble.enddate>maxX){maxX=bubble.enddate}}
												  
		var newbubble = {	key:hash.update(Date.now()+Math.random().toString()).digest('hex'),
							startdate:maxX,
							enddate:moment(maxX).add(...this.bubbleDimensions[0]).toDate(),
							y:maxY+1,
							colour:this.newbubblecolour,
							leftcolour:this.newbubblecolour,
							rightcolour:this.newbubblecolour,
							ChildBubbles: {},
							ParentBubble: "",
							highlightcolour: this.highlightcolour,
							mouseDownOn: {left: false, right: false, middle:false},
							dragDiffs: [[0,0],[0,0]],
							text: ''}
		this.props.addBubble(newbubble);
		this.forceUpdate();
		this.activeRenameModal=newbubble.key
	}

	saveToFile = ()=>{
		console.log("Saving to: "+this.selectedFile)
		var bubbleData = {}
		for (var bubblekey in this.props.bubbles){
			var bubble={...this.props.bubbles[bubblekey]};
			bubble.colour = this.getIndexFromColour(bubble.colour)
			const {highlightcolour, leftcolour, rightcolour, mouseDownOn, dragDiffs, mousedownpos, ...rest} = bubble
			bubbleData[bubble.key]=rest}
		var data = {bubbles: bubbleData}
		console.log(data)
		var url = "http://192.168.1.115:3001/write?file="+this.selectedFile+'&data='+JSON.stringify(data)
		fetch(url,{method: 'POST',header: {"Access-Control-Allow-Origin": "*", "Content-Type":"application/json"}})
			.then(response => {console.log("done")})}

	loadFromFile = ()=>{
		console.log("Loading: "+this.selectedFile)
		var url = "http://192.168.1.115:3001/read?file="+this.selectedFile
		fetch(url,{header: {"Access-Control-Allow-Origin": "*", "Content-Type":"application/json"}})
			.then(response => {return response.json()})
			.then(data => {	this.props.clearBubbles()
							this.props.clearParentBubbles()
							for (var bubblekey in data.bubbles){
								var bubble = data.bubbles[bubblekey] 
								var newbubble={
									key:bubble.key,
									startdate:new Date(bubble.startdate),
									enddate:new Date(bubble.enddate),
									y: bubble.y,
									colour:this.getColourFromIndex(bubble.colour),
									ChildBubbles: bubble.ChildBubbles,
									ParentBubble: bubble.ParentBubble,
									leftcolour:this.getColourFromIndex(bubble.colour),
									rightcolour:this.getColourFromIndex(bubble.colour),
									highlightcolour: this.highlightcolour,
									mouseDownOn: {left: false, right: false, middle:false},
									dragDiffs: [[0,0],[0,0]],
									text: bubble.text || ''}
								this.props.addBubble(newbubble)
								};						
							for (var bubblekey in this.props.bubbles){
								var bubble=this.props.bubbles[bubblekey];
								if(bubble["ParentBubble"]===''){this.props.addParentBubble(bubblekey)}
								this.props.setOriginalColour(bubble.key,'left');
								this.props.setOriginalColour(bubble.key,'right')}	
								this.forceUpdate();
								})
					}

		loadFromDB = ()=>{
			console.log("Loading: From Database")
			var url = "https://evnext-api.evlem.net/tasks"
			fetch(url,{headers: {"Access-Control-Allow-Origin": "*",
								"Content-Type":"application/json",
								"Authorization": "Bearer " + SESSIONTOKEN}})
				.then(response => {return response.json()})
				.then(data => {	console.log(data)
								if(data.error){console.log("ERROR");return}
								this.props.clearBubbles()
								this.props.clearParentBubbles()
								var i=0
								data.forEach(bubble=>{i++;console.log(bubble)
									var newbubble={
										key:bubble.id,
										startdate:new Date(bubble.start),
										enddate:new Date(bubble.end),
										y: i,
										colour:this.getColourFromAndras(bubble.status),
										ChildBubbles: {},
										ParentBubble: '',
										leftcolour:this.getColourFromAndras(bubble.status),
										rightcolour:this.getColourFromAndras(bubble.status),
										highlightcolour: this.highlightcolour,
										mouseDownOn: {left: false, right: false, middle:false},
										dragDiffs: [[0,0],[0,0]],
										text: bubble.title || ''}
										this.props.addBubble(newbubble)
									});						
								for (var bubblekey in this.props.bubbles){
									var bubble=this.props.bubbles[bubblekey];
									this.props.setOriginalColour(bubble.key,'left');
									this.props.setOriginalColour(bubble.key,'right')}	
									this.forceUpdate();
								})
					}

	leftclickdown = (key,event)=>{	this.props.mouseDownOnBubble(key,'left',true); 
									this.setHighlightColour(key,'left'); 
									this.forceUpdate();}
	rightclickdown = (key,event)=>{	this.props.mouseDownOnBubble(key,'right',true);
									this.setHighlightColour(key,'right');
									this.forceUpdate();}
	middleclickdown = (key,event)=>{this.props.mouseDownOnBubble(key,'middle',true);
									var mousedownpos = this.getInternalMousePosition(event)
									this.props.setMouseDownPos(key,mousedownpos)
									if(event.buttons===2){this.activeBubbleContextMenu = [key,mousedownpos]}
									this.props.setDragDiff(key,[
											[mousedownpos[0]-this.getNearestSnapXToDate(this.props.bubbles[key].startdate),
											mousedownpos[1]-this.props.bubbles[key].y],
											[mousedownpos[0]-this.getNearestSnapXToDate(this.props.bubbles[key].enddate),
											mousedownpos[1]-(this.props.bubbles[key].y+this.bubbleDimensions[1])]
										])}
	leftclickup = (key,event)=>{this.tryLinking(key,'left')}
	rightclickup = (key,event)=>{this.tryLinking(key,'right')}
	leftmousein = (key,event)=>{if(event.buttons!==0 && !this.props.bubbles[key].mouseDownOn.middle){
		this.setHighlightColour(key,'left');
		this.forceUpdate()}}
	leftmouseout = (key,event)=>{if(!this.props.bubbles[key].mouseDownOn.left && event.buttons!==0){
		this.props.setOriginalColour(key,'left');
		this.forceUpdate()}}
	rightmousein = (key,event)=>{if(event.buttons!==0 && !this.props.bubbles[key].mouseDownOn.middle){
		this.setHighlightColour(key,'right');
		this.forceUpdate()}}
	rightmouseout = (key,event)=>{if(!this.props.bubbles[key].mouseDownOn.right && event.buttons!==0){
		this.props.setOriginalColour(key,'right');
		this.forceUpdate()}}

	//Manages scheduler movements AND bubble movements
	mouseEvent = (event) => {
		var isOnBubble = false
		var mouse = this.getInternalMousePosition(event)
		for (var bubblekey in this.props.bubbles){
			var bubble=this.props.bubbles[bubblekey];
			if(event.buttons===0) {	
				if(bubble.mouseDownOn.left||bubble.mouseDownOn.right||bubble.mouseDownOn.middle){
					this.props.mouseDownOnBubble(bubblekey,'left',false);
					this.props.mouseDownOnBubble(bubblekey,'right',false);
					this.props.mouseDownOnBubble(bubblekey,'middle',false);}
				if(bubble.leftcolour===this.highlightcolour || bubble.rightcolour===this.highlightcolour){
					this.props.setOriginalColour(bubble.key,'left')
					this.props.setOriginalColour(bubble.key,'right')
					this.forceUpdate();}}
			if(bubble.mouseDownOn.left && !event.shiftKey){
				this.props.bubbleTransform(	bubble.key,
											{startdate: this.getNearestDateToX(mouse[0])})}
			if(bubble.mouseDownOn.right && !event.shiftKey){
				this.props.bubbleTransform(	bubble.key,
											{enddate:this.getNearestDateToX(mouse[0])})}
			if(bubble.mouseDownOn.middle){ 
				var newstartdate = this.getNearestDateToX(mouse[0]-bubble.dragDiffs[0][0])
				this.props.bubbleTransform(	bubble.key,
											{startdate: newstartdate, 
											enddate: moment(newstartdate).add(bubble.enddate-moment(bubble.startdate)).toDate(),
											y: this.getNearestIndexToY(mouse[1]-this.bubbleDimensions[1]/2)})}
			if(bubble.mouseDownOn.left||bubble.mouseDownOn.right||bubble.mouseDownOn.middle){isOnBubble=true}
		}

		//check column interaction.
		if(event.shiftKey){console.log(event)}
		if((event.buttons===0 && this.isOnScheduler) || isOnBubble){this.isOnScheduler = false}
		if(event.buttons===1 && isOnBubble){this.removeContextMenu()}
		if(event.buttons===1 && !isOnBubble && this.isOnScheduler){
			var mousedate = this.getNearestDateToX(mouse[0])
			var datediff = (mousedate-this.DownDateandSchedulerWidth[0])
			if(datediff!==0){
				newstartdate = moment(this.startdate).subtract(datediff).toDate()			
				this.setStartAndEndDate(newstartdate,moment(newstartdate).add(this.DownDateandSchedulerWidth[1],'d').toDate())
			}
		}		
	}
	removeContextMenu = () => {this.activeBubbleContextMenu=['',[0,0]];this.forceUpdate()}
	clickedOnScheduler = (event) => {
		this.isOnScheduler=true
		var mouse = this.getInternalMousePosition(event)
		this.removeContextMenu()
		var schedulerWidth = moment(this.enddate).diff(this.startdate,'d')
		var XDownDate = this.getNearestDateToX(mouse[0])
		this.DownDateandSchedulerWidth = [XDownDate,schedulerWidth]
	}

	getInternalMousePosition = (event)=>{
		var mouse = document.querySelector("svg").createSVGPoint();
		mouse.x =event.clientX
		mouse.y = event.clientY
		var mouseSVG = mouse.matrixTransform(this.svgRef.current.getScreenCTM().inverse())
		return [mouseSVG.x,mouseSVG.y]
	}	
	getNearestValueInArray = (snapsarray,value)=>{ if(snapsarray===[]){return value}
		var distancefromsnapsarray = snapsarray.slice().map((i)=>Math.abs(i-value))
		return snapsarray[distancefromsnapsarray.indexOf(Math.min(...distancefromsnapsarray))]
	}
	getNearestDateToX = (X)=>{
		var nearestsnap = this.getNearestValueInArray(this.state.snaps[0].map(i=>i[1]),X)
		var nearestsnapindex = this.state.snaps[0].map(i=>i[1]).indexOf(nearestsnap)
		return this.state.snaps[0][nearestsnapindex][0]
	}
	getNearestSnapXToDate = (date)=>{
		var daterangems = this.state.snaps[0].map(dateX=>dateX[0].valueOf())
		var nearestms = this.getNearestValueInArray(daterangems,date.valueOf())
		var nearestmsindex = daterangems.indexOf(nearestms)
		var nearestXsnap = this.state.snaps[0].map(i=>i[1])[nearestmsindex]
		return nearestXsnap
	}
	getNearestIndexToY = (Y)=>{ //TODO identical to getNearestDateToX. Make configurable? Accesses outsisde. Pass this.state.snaps[n] as arg?
		var nearestsnap = this.getNearestValueInArray(this.state.snaps[1].map(i=>i[1]),Y)
		var nearestsnapindex = this.state.snaps[1].map(i=>i[1]).indexOf(nearestsnap)
		return this.state.snaps[1][nearestsnapindex][0]
	}
	getNearestSnapYToIndex = (index)=>{
		var arrindex = this.state.snaps[1].map(indexy=>indexy[0])
		var closestsnapindextoindex = this.getNearestValueInArray(arrindex,index)
		var indexInSnaps = arrindex.indexOf(closestsnapindextoindex)
		var nearestYsnap = this.state.snaps[1].map(i=>i[1])[indexInSnaps]
		return nearestYsnap
	}
	setHighlightColour = (key,side)=>{
		var colourtoset=this.highlightcolour
		this.props.setBubbleSideColour(key,colourtoset,side)
	}
	getColourFromIndex = (index)=>{
		return this.colours[this.colours.map(i=>i[0]).indexOf(index)][1]
	}
	getColourFromAndras = (AndrasString)=>{
		return this.getColourFromIndex(this.AndrasToColour[AndrasString])
	}
	getIndexFromColour = (colourstring)=>{
		return this.colours[this.colours.map(i=>i[1]).indexOf(colourstring)][0]
	}

  	render() {
		//console.log("render scheduler")
		var BubbleElements = []
		for (var bubblekey in this.props.bubbles){
			var b = this.props.bubbles[bubblekey];
			BubbleElements.push(
				<Bubble key={b.key}
						startpoint={[this.getNearestSnapXToDate(b.startdate),this.getNearestSnapYToIndex(b.y)]} 
						endpoint={[this.getNearestSnapXToDate(b.enddate),this.getNearestSnapYToIndex(b.y)+this.bubbleDimensions[1]]} 
						colour={b.colour}
						leftclickdown={this.leftclickdown}
						rightclickdown={this.rightclickdown}
						middleclickdown={this.middleclickdown}
						leftclickup={this.leftclickup}
						rightclickup={this.rightclickup}
						leftmousein={this.leftmousein}
						leftmouseout={this.leftmouseout}
						rightmousein={this.rightmousein}
						rightmouseout={this.rightmouseout}
						leftcolour={b.leftcolour}
						rightcolour={b.rightcolour}
						bkey={b.key}
						text={b.text}/>
			)}
		return 	<div>
					<div className='Scheduler-dropdown'>
						<select onChange={(event)=>{this.selectedFile=event.target.value}}>
							<option value="a.json">a</option>
							<option value="b.json">b</option>
							<option value="c.json">c</option>
						</select>
						<button onClick={this.loadFromFile}>Load (File)</button>
						<button onClick={this.loadFromDB}>Load (DB)</button>
						<button onClick={this.saveToFile}>Save (File)</button>
						<div/>						
						<button onClick={()=>{
							this.setStartAndEndDate(moment(this.startdate).subtract(1,'d').toDate(),moment(this.enddate).add(1,'d').toDate());this.forceUpdate()}}>ZOOM -</button>
						<button onClick={()=>{
							this.setStartAndEndDate(moment(this.startdate).add(1,'d').toDate(),moment(this.enddate).subtract(1,'d').toDate());this.forceUpdate()}}>ZOOM +</button>
						<button onClick={()=>{	
							this.bubbleDimensions[1]=20;
							this.setYSnaps()
							this.forceUpdate()}}>SHRINK</button>
						<button onClick={()=>{this.forceUpdate()}}>RENDER</button>
						<button onClick={()=>{this.darkTheme=!this.darkTheme}}>Toggle Theme</button>
					</div>
					{/*Maybe add colour wheel. Also probably make another js file with these colours, so you can access them from multiple places.*/}
					<button style={{color:'black',borderColor:'black',backgroundColor:this.newbubblecolour}}>ACTIVE COLOUR </button>
					<button onClick={this.makeNewBubble}>Add bubble</button>
					{this.colours.map(colour=>
						<button key={colour} 
								onClick={()=>{
									this.newbubblecolour=colour[1]
									this.forceUpdate()}} 
								style={{color:'black',borderColor:'white',backgroundColor: colour[1]}}>
							{colour[0]}
						</button>)}
					<p/>
					<div className='Scheduler-datepicker'>
						<div className='Scheduler-startdate'>
							Start Date:
							<DatePicker dateFormat='dd/MM/yyy' 
										selected={this.startdate} 
										onChange={(newdate)=>{this.setStartAndEndDate(newdate,this.enddate)}}/>
						</div>
						<div className='Scheduler-enddate'>
							End Date:
							<DatePicker dateFormat='dd/MM/yyy'
										selected={this.enddate}
										onChange={(newdate)=>{this.setStartAndEndDate(this.startdate,newdate)}}/>
						</div>
					</div>
					<p/>
					<svg 	onContextMenu={(event)=>{event.preventDefault()}}
							ref={this.svgRef}
							viewBox={'0 0 '+this.internalSVGDimensions[0]+' '+ this.internalSVGDimensions[1]}
							transform={'scale('+this.schedulerPageScale[0]+','+this.schedulerPageScale[1]+')'}>
						<Columns 
							startpoint={[0,0]}
							endpoint={this.internalSVGDimensions}
							xsnaps={this.state.snaps[0].slice(this.extrasnaps)}
							onMouseDown={this.clickedOnScheduler}/>
						{BubbleElements}
						{this.activeBubbleContextMenu[0] ? 
							<BubbleContextMenu 
								x={this.activeBubbleContextMenu[1][0]}
								y={this.activeBubbleContextMenu[1][1]}
								options={[
									["Change Colour",()=>{
										this.props.changeOriginalColour(this.activeBubbleContextMenu[0],this.newbubblecolour);
										this.removeContextMenu()}],
									["Rename",()=>{
										this.activeRenameModal=this.activeBubbleContextMenu[0];
										this.removeContextMenu()}],
									["Unlink from Parent Bubble",()=>{
										this.props.unlinkParentBubble(this.activeBubbleContextMenu[0]);
										this.props.setOriginalColour(this.activeBubbleContextMenu[0],'left');
										this.props.setOriginalColour(this.activeBubbleContextMenu[0],'right');
										this.removeContextMenu();
										this.forceUpdate()}],
									["Delete",()=>{
										this.props.deleteBubble(this.activeBubbleContextMenu[0]);
										this.removeContextMenu()}]
								]}/>
						:	null}
						{this.activeRenameModal ? 
							<RenameModal
							startingText={this.props.bubbles[this.activeRenameModal].text}
							startpoint={[0,0]}
							endpoint={this.internalSVGDimensions}
							onMouseDown={(newName)=>{this.props.renameBubble(this.activeRenameModal,newName);this.activeRenameModal='';this.forceUpdate()}}
							onSubmit={(newName)=>{this.props.renameBubble(this.activeRenameModal,newName);this.activeRenameModal='';this.forceUpdate()}}/>
						:	null}
					</svg>
				</div>
	}
}

const mapStateToProps = state => {
	return {
		bubbles: state.bubbles,
		parentbubbles: state.parentbubbles,
	}
}

const mapDispatchToProps = dispatch => {
	return {
		addBubble: (newbubble) => dispatch({type:'NEW_BUBBLE',bubble:newbubble}),
		clearBubbles: ()=>dispatch({type:'CLEAR_BUBBLES'}),
		mouseDownOnBubble: (key,side,bool)=> dispatch({type:'MOUSE_DOWN_ON_BUBBLE',key:key,side:side,bool:bool}),
		setMouseDownPos: (key,pos) => dispatch({type:'MOUSE_DOWN_POS',key:key,position:pos}),
		setDragDiff: (key,diffs) => dispatch({type:'SET_DRAG_DIFF',key:key,diffs:diffs}),
		setBubbleSideColour: (key,colour,side) => dispatch({type:'SET_BUBBLE_SIDE_COLOUR', key:key,colour:colour,side:side}),
		setOriginalColour: (key,side) => dispatch({type:'SET_ORIGINAL_COLOUR',key:key,side:side}),
		clearParentBubbles: () => dispatch({type:'CLEAR_PARENT_BUBBLES'}),
		addParentBubble: (key) => dispatch({type:'ADD_PARENT_BUBBLE',key:key}),
		bubbleTransform: (key,changes) => dispatch({type: 'BUBBLE_TRANSFORM',key:key,changes:changes}),
		performLink: (childkey,parentkey,childside,parentside)=> dispatch({type: 'PERFORM_LINK',parentkey:parentkey,childkey:childkey,parentside:parentside,childside:childside}),
		deleteBubble: (key) => dispatch({type:'DELETE_BUBBLE',key:key}),
		changeOriginalColour: (key,colour) => dispatch({type:'CHANGE_BUBBLE_COLOUR',key:key,colour:colour}),
		renameBubble: (key,text) => dispatch({type:'RENAME_BUBBLE',key:key,text:text}),
		unlinkParentBubble: (key) => dispatch({type:'UNLINK_PARENT_BUBBLE',key:key})
	}
}

export default connect(mapStateToProps,mapDispatchToProps)(Scheduler);