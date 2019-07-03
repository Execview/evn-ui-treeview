import React, { Component } from 'react';
import SchedulerCell from '../schedulerCell/SchedulerCell'
import SchedulerHeader from '../schedulerCell/SchedulerHeader';
import { recursiveDeepDiffs, objectCopierWithStringToDate } from '@execview/reusable';


var Rx = require('rxjs/Rx')
var moment = require('moment')

var mousepositionstream = Rx.Observable.fromEvent(document,'pointermove').merge(Rx.Observable.fromEvent(document,'pointerdown'))

export default class SchedulerAppender extends Component {
		constructor(props){
		super(props)		
		mousepositionstream.subscribe((event)=>this.mouseEvent(event))
		this.tableRef= React.createRef();

		this.bubbleHeight = 30;

		this.state = {startdate: null, enddate: null, snaps: [], dayWidth: 80, rowHeights: [], bubbleContextMenu: {key:null,position:null}}
		this.viewingPeriod = 1
		this.extrasnaps = 2

		//this.InitialStartDate = new Date("2018-12-15")
		//Object.keys(this.props.data).map(key=>{return this.props.data[key].startdate})[0] ;//new Date("2019-02-15")
		this.Lightcolours = [	['Blue','rgb(190,230,240)'],
								['Red','rgb(240,180,190)'],
								['Green','rgb(180,240,200)'],
								['Yellow','rgb(250,250,190)'],
								['Purple','rgb(240,190,250)'],
								['Grey','rgb(100,100,100)']]
		this.Darkcolours = [	['Blue','rgb(130,200,210)'],
								['Red','rgb(210,115,130)'],
								['Green','rgb(100,200,135)'],
								['Yellow','rgb(240,240,160)'],
								['Purple','rgb(220,160,230)'],
								['Grey','rgb(240,240,240)']]
		/*this.RAGcolours = 	[['Blue','grey'],
								['Red','#ff3d57'],
								['Green','#00CC6F'],
								['Yellow','#ffbf00'],
								['Purple','white']]*/
		this.testColours = [	['Blue','rgb(130,200,210)'],
								['Red','rgb(210,115,130)'],
								['Green','rgb(100,200,135)'],
								['Yellow','#ffbf00'],
								['Purple','rgb(220,160,230)'],
								['Grey','rgb(240,240,240)']]
		this.UNSATColours = [	['Blue','rgb(117, 215, 255)'],
								['Red','rgb(255, 63, 114)'],
								['Green','rgb(89, 224, 114)'],
								['Yellow','rgb(240, 255, 84)'],
								['Purple','rgb(250, 107, 255)'],
								['Grey','rgb(240,240,240)']]


		this.colours = this.UNSATColours
		this.schedulerWidth= 0;
		this.mouseDownOnBubble = {key:'',location:'',dragDiffs:[0,0]}
		this.schedulerCTM = null
		this.isOnScheduler = false //is mouse down on the scheduler
		this.DownDateandSchedulerWidth = [0,new Date("1970-01-01")] //temporary variable needed when scrolling scheduler with mouse

		this.highlightcolour = 'Grey'
	}
	componentDidMount(){
		let earliestBubble = new Date(Math.min(...Object.keys(this.props.data).map(key=>this.props.data[key].startdate)))
		this.setStartDate(earliestBubble);
	}
    shouldComponentUpdate(nextProps,nextState) {
	if(nextState!==this.state){return true}
	const filterReactComponent = (c) => {
		const { _owner, $$typeof, ...rest } = c;
		return rest;
	};
	const stopRecursion = (o, u) => {
		if (React.isValidElement(o) && React.isValidElement(u)) {
			if (recursiveDeepDiffs(filterReactComponent(o), filterReactComponent(u), { stopRecursion })) {
			return 'updated';
			}
			return 'ignore';
		}
		return 'continue';
	};
	const diffs = recursiveDeepDiffs(this.props, nextProps, { stopRecursion });
	return diffs;
	}

	setStartDate = (start)=>{
		let end = moment(start).add(this.schedulerWidth/this.state.dayWidth,'d').toDate()
		this.setStartAndEndDate(start,end)
	}

	setStartAndEndDate = (start,end) =>{
		if(end-start<0){return}
		const getDateRange = (start, end)=>{
			var daterange = []
			for(var currentdate=moment(start); currentdate.isSameOrBefore(end); currentdate.add(1,'d')){
				daterange.push(moment(currentdate).toDate())
			}
			return daterange
		}
		var daterange = getDateRange(moment(start).subtract(this.extrasnaps,'d').toDate(),moment(end).add(this.extrasnaps,'d').toDate());
		let newXsnaps = []
		for(var i=0;i<daterange.length;i++){
			//newXsnaps.push([daterange[i],i*(this.state.schedulerWidth/(daterange.length))])
			newXsnaps.push([daterange[i],(i-this.extrasnaps)*this.state.dayWidth])
		}
		this.setState({
			startdate: start,
			enddate: end,
			snaps: newXsnaps})
	}

	setMode = (m) => {
		console.log("selected: "+m)
		const modeToDays = [1,7,30,90]
		this.viewingPeriod = m
		this.setStartAndEndDate(this.state.startdate,moment(this.state.startdate).add(modeToDays[m],'d').toDate())
	}

	getInternalMousePosition = (event,CTM)=>{
		const svg = document.querySelector("svg")
		if(!svg){return [0,0]}
		var mouse = svg.createSVGPoint();
		mouse.x =event.clientX
		mouse.y = event.clientY
		var mouseSVG = CTM ? mouse.matrixTransform(CTM.inverse()) : {x:0,y:0}
		return [mouseSVG.x,mouseSVG.y]
	}

	leftclickdown = (key,event)=>{	
		this.mouseDownOnBubble.key = key
		this.mouseDownOnBubble.location = 'left'
		this.schedulerCTM = event.target.closest('svg').getScreenCTM();
		this.props.setBubbleSideColour(key,this.highlightcolour,'left')
		this.forceUpdate();}
	rightclickdown = (key,event)=>{	
		this.mouseDownOnBubble.key = key
		this.mouseDownOnBubble.location = 'right'
		this.schedulerCTM = event.target.closest('svg').getScreenCTM();
		this.props.setBubbleSideColour(key,this.highlightcolour,'right')
		this.forceUpdate();}

	middleclickdown = (key,event)=>{
		this.mouseDownOnBubble.key = key;
		this.mouseDownOnBubble.location = 'middle'
		this.schedulerCTM = event.target.closest('svg').getScreenCTM();
		var mousedownpos = this.getInternalMousePosition(event,this.schedulerCTM)
		this.mouseDownOnBubble.dragDiffs =[
			mousedownpos[0]-this.getNearestSnapXToDate(this.props.data[key].startdate),
			mousedownpos[0]-this.getNearestSnapXToDate(this.props.data[key].enddate)
		]
		this.forceUpdate();
	}

	onContextMenu = (key,event)=>{
		event.preventDefault();
		this.schedulerCTM = event.target.closest('svg').getScreenCTM();
		var mousedownpos = this.getInternalMousePosition(event,this.schedulerCTM)	
		this.setState({bubbleContextMenu:{key:key,position:mousedownpos}})
	}
	leftclickup = (key,event)=>{
		if(key!==this.mouseDownOnBubble.key){
			this.props.tryPerformLink(key,this.mouseDownOnBubble.key,'left',this.mouseDownOnBubble.location);
		}
		this.props.setOriginalColour(key,'left')
		
	}
	rightclickup = (key,event)=>{	
		if(key!==this.mouseDownOnBubble.key){	
			this.props.tryPerformLink(key,this.mouseDownOnBubble.key,'right',this.mouseDownOnBubble.location);
		}
		this.props.setOriginalColour(key,'right')
	}
	middleclickup = (key,event)=>{
		if(!['left','right'].includes(this.mouseDownOnBubble.location) && key!==this.mouseDownOnBubble.key){
			this.props.tryPerformAssociation(key,this.mouseDownOnBubble.key);
		}
		this.props.setOriginalColour(key,'left')
		this.props.setOriginalColour(key,'middle')
		this.props.setOriginalColour(key,'right')}
	leftmousein = (key,event)=>{if(	event.buttons!==0 && this.mouseDownOnBubble.key!==key && this.mouseDownOnBubble.location!=='middle'){
		this.props.setBubbleSideColour(key,this.highlightcolour,'left')}}
	leftmouseout = (key,event)=>{if(event.buttons!==0 && this.mouseDownOnBubble.key!==key && this.mouseDownOnBubble.location!=='middle'){
		this.props.setOriginalColour(key,'left')}}
	rightmousein = (key,event)=>{if(event.buttons!==0 && this.mouseDownOnBubble.key!==key && this.mouseDownOnBubble.location!=='middle'){
		this.props.setBubbleSideColour(key,this.highlightcolour,'right')}}
	rightmouseout = (key,event)=>{if(event.buttons!==0 && this.mouseDownOnBubble.key!==key && this.mouseDownOnBubble.location!=='middle'){
		this.props.setOriginalColour(key,'right')}}
	middlemousein = (key,event)=>{if(event.buttons!==0 && this.mouseDownOnBubble.key!==key && this.mouseDownOnBubble.location==='middle'){
		this.props.setBubbleSideColour(this.mouseDownOnBubble.key,this.props.data[key].colours.original,'middle')}}
	middlemouseout = (key,event)=>{if(event.buttons!==0 && this.mouseDownOnBubble.key!==key && this.mouseDownOnBubble.location==='middle'){
		this.props.setOriginalColour(key,'middle');
		this.props.setOriginalColour(this.mouseDownOnBubble.key,'middle')}}

	mouseEvent = (event) => {
		if(this.isOnScheduler){event.preventDefault()}
		var mouse = this.getInternalMousePosition(event,this.schedulerCTM)
		var bubble=this.props.data[this.mouseDownOnBubble.key];
		if(event.buttons===0) {
			this.schedulerCTM=null
			if(this.mouseDownOnBubble.key){
				this.mouseDownOnBubble.dragDiffs=[0,0]
				this.props.setOriginalColour(this.mouseDownOnBubble.key,'left')
				this.props.setOriginalColour(this.mouseDownOnBubble.key,'right')
				this.props.setOriginalColour(this.mouseDownOnBubble.key,'middle')
				this.mouseDownOnBubble.location="";
				this.mouseDownOnBubble.key='';
				this.forceUpdate()}}
		const key = this.mouseDownOnBubble.key
		const nearestDateToX = this.getNearestDateToX(mouse[0]-this.mouseDownOnBubble.dragDiffs[0])
		if(this.mouseDownOnBubble.location==='left' && !event.shiftKey && nearestDateToX.getTime()!==this.props.data[key].startdate.getTime()){
			this.bubbleTransform(	key,
										{startdate: nearestDateToX})}
		if(this.mouseDownOnBubble.location==='right' && !event.shiftKey && nearestDateToX.getTime()!==this.props.data[key].enddate.getTime()){
			this.bubbleTransform(	key,
										{enddate: nearestDateToX})}
		if(this.mouseDownOnBubble.location==='middle' && !event.shiftKey && nearestDateToX.getTime()!==this.props.data[key].startdate.getTime()){
			this.bubbleTransform(	key,
										{startdate: nearestDateToX,
										enddate: moment(nearestDateToX).add(bubble.enddate-bubble.startdate).toDate()})
		}
		//check column interaction.
		if((event.buttons===0 && this.isOnScheduler) || this.mouseDownOnBubble.key){this.isOnScheduler = false}
		if(event.buttons===1 && this.mouseDownOnBubble.key){/*this.removeContextMenu()*/}
		if(event.buttons===1 && !this.mouseDownOnBubble.key && this.isOnScheduler){
			var mousedate = this.getNearestDateToX(mouse[0])
			var datediff = (mousedate-this.DownDateandSchedulerWidth[0])
			if(datediff!==0){
				const newstart = moment(this.state.startdate.getTime()-datediff).toDate()
				this.setStartDate(newstart)
			}
		}
	}

	clickedOnScheduler = (event) => {
		if(this.mouseDownOnBubble.key==="")
		{
			const closestSVG = event.target.closest('svg')
			if(!closestSVG){return}
			this.isOnScheduler=true
			this.schedulerCTM = closestSVG.getScreenCTM()
			var mouse = this.getInternalMousePosition(event, this.schedulerCTM)
			// this.removeContextMenu()
			var schedulerWidth = moment(this.state.enddate).diff(this.state.startdate,'d')
			var XDownDate = this.getNearestDateToX(mouse[0])
			this.DownDateandSchedulerWidth = [XDownDate,schedulerWidth]
		}
	}


	getNearestValueInArray = (snapsarray,value)=>{ if(snapsarray===[]){return value}
		var distancefromsnapsarray = snapsarray.slice().map((i)=>Math.abs(i-value))
		return snapsarray[distancefromsnapsarray.indexOf(Math.min(...distancefromsnapsarray))]
	}

	getNearestDateToX = (X)=>{
		var nearestsnap = this.getNearestValueInArray(this.state.snaps.map(i=>i[1]),X)
		var nearestsnapindex = this.state.snaps.map(i=>i[1]).indexOf(nearestsnap)
		return this.state.snaps[nearestsnapindex][0]
	}

	getNearestSnapXToDate = (date)=>{
		var daterangems = this.state.snaps.map(dateX=>dateX[0].valueOf())
		var nearestms = this.getNearestValueInArray(daterangems,date.valueOf())
		var nearestmsindex = daterangems.indexOf(nearestms)
		var nearestXsnap = nearestmsindex!==-1 ? this.state.snaps[nearestmsindex][1] : 0
		return nearestXsnap
	}

	getColourFromMap = (lookup,map)=>{
		let colourindex = map.map(el=>el[0]).indexOf(lookup)
		let displaycolour = colourindex!==-1 ? map[colourindex][1] : 'white'
		return displaycolour
	}

	getRowHeights = (ref)=>{
		return (ref && ref.current) ? [...ref.current.getElementsByTagName('tr')].map(el=>el.clientHeight) : []
	}

	setWidth = (width)=>{
		if(width!==this.schedulerWidth){
			// this.setState({ schedulerWidth: width });
			this.schedulerWidth=width;
			
			if(this.state.startdate){this.setStartDate(this.state.startdate)}
		}
	}
	
	onTableRender = ()=>{
		const newRowHeights=this.getRowHeights(this.tableRef);
		if(JSON.stringify(this.state.rowHeights)!==JSON.stringify(newRowHeights)){
			this.setState({rowHeights: newRowHeights})
		}
	}

	onSaveScheduler = (rowId, rowValues, editableValues) => {
		const row = this.props.data[rowId]
		const tableRowValues = Object.keys(row).reduce((total,col)=>{return {...total,[col]:rowValues[col]}},{})
		let newRowValues = objectCopierWithStringToDate(tableRowValues)
		const changes = recursiveDeepDiffs(row,newRowValues)
		this.bubbleTransform(rowId,changes,editableValues)
	}

	bubbleTransform = (key,changes,editableValues) => {
		this.props.tryBubbleTransform(key,changes,editableValues)
	}

	addSchedulerColumn = ()=>{
		const rowHeights = this.getRowHeights(this.tableRef);
		const getRowY = (i) => {
			return [...rowHeights].splice(0,i).reduce((total,rh)=>total+rh,0)
		}
		const displayedRows = Object.keys(this.props.data)
		const drawLinks = [] 
		for(let i=0; i<displayedRows.length; i++){
			const rowId = displayedRows[i]
			let childlinks = this.props.data[rowId].ChildBubbles
			for(const childId in childlinks){
				if(!(this.props.data[rowId] && this.props.data[childId])) {continue;}
				const parentdate = this.props.data[rowId]['right'=== childlinks[childId].parentside ? "enddate" : "startdate"]
				const childdate = this.props.data[childId]['right'=== childlinks[childId].childside ? "enddate" : "startdate"]

				const parentx = this.getNearestSnapXToDate(parentdate)
				const parenty = getRowY(i+1)+this.bubbleHeight/2

				const childx = this.getNearestSnapXToDate(childdate) 
				const childy = getRowY(displayedRows.indexOf(childId)+1) - 1 + this.bubbleHeight/2

				const xDirection = Math.abs((childx-parentx)/2)

				const parentvectorx = parentx + xDirection * ('right'=== childlinks[childId].parentside ? 1 : -1)
				const parentvectory = parenty

				const childvectorx = childx + xDirection * ('right'=== childlinks[childId].childside ? 1 : -1)
				const childvectory = childy			

				const link = {
					parent: [parentx,parenty],
					parentVector: [parentvectorx,parentvectory],
				 	child: [childx,childy],					
					childVector: [childvectorx,childvectory]
				}
				drawLinks.push(link)
			}
		}

		let newColumnsInfo = {...this.props.columnsInfo}
			const schedulerheaderdata = {
				snaps: this.state.snaps,
				tableHeight: this.state.rowHeights.reduce((total,rh)=>total+rh,0),
				links: drawLinks,
				getWidth: this.setWidth,
				mouseOnScheduler: this.clickedOnScheduler,
				contextMenu: {
					key: this.state.bubbleContextMenu.key,
					position: this.state.bubbleContextMenu.position?[this.state.bubbleContextMenu.position[0],getRowY(displayedRows.indexOf(this.state.bubbleContextMenu.key)+1)+this.state.bubbleContextMenu.position[1]]:[0,0],
					closeMenu: ()=>{this.setState({bubbleContextMenu:{key:null,position:null}})},
					options: {
						removeLink: <div onClick={() => this.props.onRemoveLink(this.state.bubbleContextMenu.key)}>Remove Link</div>, 
						deleteSingle: <div onClick={()=>this.props.deleteSingle(this.state.bubbleContextMenu.key)}>Delete Single</div>,
						deleteBubble: <div onClick={()=>this.props.deleteBubble(this.state.bubbleContextMenu.key)}>Delete Bubble</div> }
				},
				schedulerOptions: {
					mode: [this.viewingPeriod,((m)=>this.setMode(m))],
					start: [this.state.startdate, ((date)=>this.setStartDate(date))]
				}
			}
			newColumnsInfo = {...this.props.columnsInfo, scheduler: {cellType: 'scheduler', width: 65, headerType: 'schedulerHeader', headerData: schedulerheaderdata}}
		return newColumnsInfo
	}

	addSchedulerData = ()=>{
		let tableData = {...this.props.data}
		for(const rowId in this.props.data ){
			const shadow = rowId===this.mouseDownOnBubble.key ? true : false
			tableData[rowId] = {...tableData[rowId],
				scheduler:{
					//Bubble Data
					bkey: rowId,
					startpoint: [this.getNearestSnapXToDate(tableData[rowId].startdate),0],
					endpoint: [this.getNearestSnapXToDate(tableData[rowId].enddate),this.bubbleHeight],
					colour: this.getColourFromMap(tableData[rowId].colours.middle,this.colours),
					leftcolour: this.getColourFromMap(tableData[rowId].colours.left,this.colours),
					rightcolour: this.getColourFromMap(tableData[rowId].colours.right,this.colours),
					leftclickdown:this.leftclickdown,
					rightclickdown:this.rightclickdown,
					middleclickdown:this.middleclickdown,
					leftclickup:this.leftclickup,
					rightclickup:this.rightclickup,
					middleclickup:this.middleclickup,
					leftmousein:this.leftmousein,
					leftmouseout:this.leftmouseout,
					rightmousein:this.rightmousein,
					rightmouseout:this.rightmouseout,
					middlemousein:this.middlemousein,
					middlemouseout:this.middlemouseout,
					onContextMenu:this.onContextMenu,
					text:tableData[rowId].activityTitle,
					shadow: shadow,
					mouseOnScheduler: this.clickedOnScheduler,
					shape: tableData[rowId].shape
				}
			}
		}
		return tableData
	}

  	render() {
		const {tryBubbleTransform,setBubbleSideColour,setOriginalColour,tryPerformLink,tryPerformAssociation,onRemoveLink,deleteBubble,...newProps} = this.props
    	return (
			React.cloneElement(newProps.children,
				{...newProps,
					children: newProps.children && newProps.children.props.children,
					data: this.addSchedulerData(),
					columnsInfo: this.addSchedulerColumn(),
					cellTypes: {...newProps.cellTypes, schedulerHeader: {display: <SchedulerHeader/>}, scheduler: {display: <SchedulerCell/>}},
					tableRef: this.tableRef,
					onRender: ((x)=>{(newProps.onRender && newProps.onRender(x));this.onTableRender()}),
					onSave: ((rowId, rowValues, editableValues)=>{( this.props.onSave && this.props.onSave(rowId, rowValues, editableValues)); this.onSaveScheduler(rowId, rowValues, editableValues); })
				}
			)
		);
  	}
}