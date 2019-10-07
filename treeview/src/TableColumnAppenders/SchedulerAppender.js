import React, { useState, useEffect } from 'react';
import SchedulerCell from '../schedulerCell/SchedulerCell'
import SchedulerHeader from '../schedulerCell/SchedulerHeader';
import { recursiveDeepDiffs, objectCopierWithStringToDate, injectObjectInObject } from '@execview/reusable';

import { getDrawnLinksFromData, getSnaps, getTimeFormatString, getMajorStartOf } from './SchedulerBehavior'
import { getColourFromMap } from './BubbleBehavior'
import {getNearestSnapXToDate, getInternalMousePosition, getNearestSnapDateToX, getExactNearestSnapDateToX, getYPositionFromRowId} from './schedulerFunctions'
import { UNSATColours, Lightcolours, Darkcolours, testColours } from './colourOptions'


var Rx = require('rxjs/Rx')
var moment = require('moment')

const mousepositionstream = Rx.Observable.fromEvent(document,'pointermove').merge(Rx.Observable.fromEvent(document,'pointerdown'))

const SchedulerAppender = (props) => {

	useEffect(()=>{
		const mouseSubscription = mousepositionstream.subscribe((event)=>mouseEvent(event))
		return ()=>{mouseSubscription.unsubscribe()}
	})

	const colours = props.colours || UNSATColours	
	const rowHeight = props.height || 25	
	const bubbleHeight = rowHeight*0.9
	const timeWidth = props.timeWidth || 70
	
	const highlightcolour = 'Grey'

	const [rowHeights, setRowHeights] = useState([])
	const [schedulerWidth, setSchedulerWidth] = useState(0)

	const [bubbleContextMenuKeyAndPosition, setBubbleContextMenuKeyAndPosition] = useState({key:null,position:null})
	const [mouseDownOnBubble, setMouseDownOnBubble] = useState({key:'',location:'',dragDiffs:[0,0]})
	const [mouseDownOnScheduler, setMouseDownOnScheduler] = useState(null)

	const tempSchedulerResolution = props.resolution || 'day';

	const initialStartDate = props.start || new Date(Math.min(...Object.keys(props.data).map(key=>props.data[key].startdate)))
	const [schedulerStart, actuallySetSchedulerStart] = useState(null)
	useEffect(()=>{setSchedulerStart(initialStartDate)},[])

	const [schedulerResolution, actuallySetSchedulerResolution] = useState(tempSchedulerResolution)

	const extrasnaps = 0 //Math.ceil(schedulerWidth/timeWidth)

	const canOpenRightClickMenu = (key) => {
		return props.editableCells && props.editableCells[key] && props.editableCells[key].includes('scheduler')
	}

	const getEditableBubbleSides = (key) => {
		const propertyToSide = {startdate: 'left', enddate: 'right'}
		const schedulerChangableProperties = ['startdate','enddate']
		let editableSides = props.editableCells && props.editableCells[key] && props.editableCells[key].filter(col=>schedulerChangableProperties.includes(col)).map(property=>propertyToSide[property])
		if(editableSides && editableSides.includes('left') && editableSides.includes('right')){editableSides.push('middle')}
		return editableSides
	}
	const isBubbleSideEditable = (key,side) => {
		const editableSides = getEditableBubbleSides(key)
		return editableSides ? editableSides.includes(side) : false
	}

	const getShiftedStart = (d,r) => {
		// EXPERIMENTAL -- deals with all the snaps being on sunday. REMOVE WHEN STUFF WORKS PROPERLY
		if (r === 'week') {
			return moment(d).startOf(r).day(5).toDate()
		}
		return moment(d).startOf(r).toDate()
	}

	const setSchedulerStart = (date) => {
		const d = getShiftedStart(date,schedulerResolution)
		actuallySetSchedulerStart(d)
	}
	
	const setSchedulerResolution = (res) => {
		actuallySetSchedulerResolution(res)
		actuallySetSchedulerStart(getShiftedStart(schedulerStart,res))
	}

	const tableRef= React.createRef();

	const snaps = getSnaps(schedulerStart, schedulerResolution, schedulerWidth, timeWidth, extrasnaps)

	
	//#region Mouse Interactions
	const bubbleclickdown = (key,event,side)=>{
		if(!isBubbleSideEditable(key,side)){return}
		setMouseDownOnBubble({key:key, location:side, dragDiffs:[0,0]})
		props.setBubbleSideColour(key,highlightcolour,side)
		props.clearChanges();
	}

	const bubblemiddleclickdown = (key,event,side)=>{
		if(!isBubbleSideEditable(key,side)){return}
		const mousedownpos = getInternalMousePosition(event)
		const dragDiffs =[
			mousedownpos[0]-getNearestSnapXToDate(props.data[key].startdate,snaps),
			mousedownpos[0]-getNearestSnapXToDate(props.data[key].enddate,snaps)
		]
		setMouseDownOnBubble({key, location:side, dragDiffs})
		props.clearChanges();
	}

	const bubbleclickup = (key,event,side)=>{
		if(!isBubbleSideEditable(key,side)){return}
		if(key !== mouseDownOnBubble.key){
			props.tryPerformLink(key, mouseDownOnBubble.key, side, mouseDownOnBubble.location);
		}
		props.setOriginalColour(key, side)
	}
	const bubblemiddleclickup = (key,event, side)=>{
		if(!isBubbleSideEditable(key,side)){return}
		if(!['left','right'].includes(mouseDownOnBubble.location) && key!==mouseDownOnBubble.key){
			//props.tryPerformAssociation(key, mouseDownOnBubble.key);
		}
		props.setOriginalColour(key,'left'); props.setOriginalColour(key,'middle'); props.setOriginalColour(key,'right')
	}

	const bubblemousein = (key, event, side)=>{if(	event.buttons!==0 && mouseDownOnBubble.key!==key && mouseDownOnBubble.location!=='middle'){
		if(!isBubbleSideEditable(key,side)){return}
		props.setBubbleSideColour(key, highlightcolour, side)}
	}
	const bubblemiddlemousein = (key,event,side)=>{if(event.buttons!==0 && mouseDownOnBubble.key!==key && mouseDownOnBubble.location==='middle'){
		if(!isBubbleSideEditable(key,side)){return}
		//props.setBubbleSideColour(mouseDownOnBubble.key,props.data[key].colours.original,'middle')
	}}
	
	const bubblemouseout = (key,event, side)=>{if(event.buttons!==0 && mouseDownOnBubble.key!==key && mouseDownOnBubble.location!=='middle'){
		if(!isBubbleSideEditable(key,side)){return}
		props.setOriginalColour(key,side)}}
	const bubblemiddlemouseout = (key,event,side)=>{if(event.buttons!==0 && mouseDownOnBubble.key!==key && mouseDownOnBubble.location==='middle'){
		if(!isBubbleSideEditable(key,side)){return}
		props.setOriginalColour(key,side);
		props.setOriginalColour(mouseDownOnBubble.key,'middle')}}

	const bubbleOnContextMenu = (key,event)=>{
		event.preventDefault();
		if(!canOpenRightClickMenu(key)){return}
		const position = getInternalMousePosition(event)
		setBubbleContextMenuKeyAndPosition({key:key, position:position});
		
	}

	const mouseEvent = (event) => {
		const key = mouseDownOnBubble.key
		if(key && !props.data[key]){return}
		if(mouseDownOnScheduler){event.preventDefault()}
		var mouse = getInternalMousePosition(event)
		var bubble=props.data[key];
		if(event.buttons===0) {
			if(key){
				if(props.itemChanges) {
					// props.tryBubbleTransform(key, {startdate: getNearestSnapDateToX(getNearestSnapXToDate(bubble.startdate,snaps),snaps), enddate: getNearestSnapDateToX(getNearestSnapXToDate(bubble.enddate,snaps),snaps)})
					props.sendChanges(props.itemChanges);
				}
				props.setOriginalColour(key,'left'); props.setOriginalColour(key,'right'); props.setOriginalColour(key,'middle')
				setMouseDownOnBubble({key:'',location:'',dragDiffs:[0,0]})
			}
		}
		if(['left','right','middle'].includes(mouseDownOnBubble.location)){
			const nearestDateToX = getNearestSnapDateToX(mouse[0] - mouseDownOnBubble.dragDiffs[0],snaps)
			let potentialStart = nearestDateToX
			let potentialEnd = nearestDateToX

			const startChanged = Math.abs(potentialStart.getTime()-props.data[key].startdate.getTime())!==0
			const endChanged = Math.abs(potentialEnd.getTime()-props.data[key].enddate.getTime())!==0

			
			//EXPERIMENTAL -- use when using the move that doesn't snap
			// potentialStart = new Date(potentialStart.getFullYear(),potentialStart.getMonth(),potentialStart.getDate(),potentialStart.getHours())
			// potentialEnd = new Date(potentialEnd.getFullYear(),potentialEnd.getMonth(),potentialEnd.getDate(),potentialEnd.getHours())

			switch(mouseDownOnBubble.location){
				case 'left': {
					if(mouseDownOnBubble.location==='left' && !event.shiftKey && startChanged){
						props.tryBubbleTransform(key, {startdate: potentialStart})
					}
					break;
				}
				case 'right': {
					if(mouseDownOnBubble.location==='right' && !event.shiftKey && endChanged){
						props.tryBubbleTransform(key, {enddate: potentialEnd })
					}
					break;
				}
				case 'middle': {
					if(mouseDownOnBubble.location==='middle' && !event.shiftKey && startChanged){
						props.tryBubbleTransform(key, {
							startdate: potentialStart,
							enddate: moment(nearestDateToX).add(bubble.enddate-bubble.startdate).toDate()
						})
					}
					break;
				}
				default: break;
			}	
		}
		//check column interaction.
		if((event.buttons===0 && mouseDownOnScheduler) || key){setMouseDownOnScheduler(null)}
		if(event.buttons===1 && !key && mouseDownOnScheduler){
			const mousedate = getNearestSnapDateToX(mouse[0],snaps)
			const datediff = (mousedate-mouseDownOnScheduler)
			if(datediff !== 0) {
				const newstart = moment(schedulerStart.getTime() - datediff).toDate()
				setSchedulerStart(newstart)
			}
		}
	}

	const clickedOnScheduler = (event) => {
		if(!mouseDownOnBubble.key) {
			const mouse = getInternalMousePosition(event)
			const XDownDate = getNearestSnapDateToX(mouse[0],snaps)
			setMouseDownOnScheduler(XDownDate)
		}
	}
	//#endregion

	const addSchedulerColumn = ()=>{
		const contextMenuPosition = bubbleContextMenuKeyAndPosition.position && [bubbleContextMenuKeyAndPosition.position[0],getYPositionFromRowId(bubbleContextMenuKeyAndPosition.key,rowHeights)+bubbleContextMenuKeyAndPosition.position[1]]
		const schedulerheaderdata = {
			snaps: snaps,
			tableRef: tableRef,
			links: getDrawnLinksFromData(props.data,((id)=>getYPositionFromRowId(id,rowHeights)+(((rowHeights[id] || {}).height || 0)/2)),snaps),
			getWidth: ((w)=>{if(w!==schedulerWidth){setSchedulerWidth(w)}}),
			mouseOnScheduler: clickedOnScheduler,
			timeFormatString: getTimeFormatString(schedulerResolution),
			contextMenu: {
				position: contextMenuPosition,
				closeMenu: ()=>{setBubbleContextMenuKeyAndPosition({key:null,position:null})},
				options: {
					removeLink: <div onClick={()=>{props.onRemoveLink(bubbleContextMenuKeyAndPosition.key)}}>Remove Link</div>, 
					deleteBubble: <div onClick={()=>{props.deleteBubble(bubbleContextMenuKeyAndPosition.key)}}>Delete Bubble</div> }
			},
			schedulerOptions: {
				mode: [schedulerResolution,((r)=>setSchedulerResolution(r))],
				start: [schedulerStart, ((date)=>setSchedulerStart(date))]
			}
		}
		const newColumn = {scheduler: {cellType: 'scheduler', width: 65, height: rowHeight, headerType: <SchedulerHeader data={schedulerheaderdata}/>}};
		let position = 'end';
		if (props.schedulerOptions) {
			if (props.schedulerOptions.width) {
				newColumn.scheduler.width = props.schedulerOptions.width;
			}
			position = props.schedulerOptions.position || 'end';
		}
		
		return injectObjectInObject(props.columnsInfo, newColumn, position)
	}

	const addSchedulerData = ()=>{
		let tableData = {...props.data}
		for(const rowId in tableData ){
			const shadow = rowId===mouseDownOnBubble.key ? true : false
			tableData[rowId] = {...tableData[rowId],
				scheduler:{
					//Bubble Data
					bkey: rowId,
					startpoint: [getNearestSnapXToDate(tableData[rowId].startdate,snaps),0],
					endpoint: [getNearestSnapXToDate(tableData[rowId].enddate,snaps),bubbleHeight],
					colour: getColourFromMap(tableData[rowId].colours.middle,colours),
					leftcolour: getColourFromMap(tableData[rowId].colours.left,colours),
					rightcolour: getColourFromMap(tableData[rowId].colours.right,colours),
					leftclickdown: ((k,e)=>bubbleclickdown(k,e,'left')),
					rightclickdown:((k,e)=>bubbleclickdown(k,e,'right')),
					middleclickdown:((k,e)=>bubblemiddleclickdown(k,e,'middle')),
					leftclickup:((k,e)=>bubbleclickup(k,e,'left')),
					rightclickup:((k,e)=>bubbleclickup(k,e,'right')),
					middleclickup:((k,e)=>bubblemiddleclickup(k,e,'middle')),
					leftmousein:((k,e)=>bubblemousein(k,e,'left')),
					rightmousein:((k,e)=>bubblemousein(k,e,'right')),
					middlemousein:((k,e)=>bubblemiddlemousein(k,e,'middle')),
					leftmouseout:((k,e)=>bubblemouseout(k,e,'left')),					
					rightmouseout:((k,e)=>bubblemouseout(k,e,'right')),					
					middlemouseout:((k,e)=>bubblemiddlemouseout(k,e,'middle')),
					onContextMenu:((k,e)=>bubbleOnContextMenu(k,e)),
					text:tableData[rowId].name,
					shadow: shadow,
					mouseOnScheduler: clickedOnScheduler,
					shape: tableData[rowId].shape,
					editableSides: getEditableBubbleSides(rowId)
				}
			}
		}
		return tableData
	}	

	const onSaveScheduler = (rowId, rowValues, editableValues) => {
		const row = props.data[rowId]
		const tableRowValues = Object.keys(row).reduce((total,col)=>{return {...total,[col]:rowValues[col]}},{})
		const newRowValues = objectCopierWithStringToDate(tableRowValues)
		const changes = recursiveDeepDiffs(row,newRowValues)
		props.tryBubbleTransform(rowId,changes,editableValues,true)
	}

	const onTableRender = ()=>{
		const getRowHeights = (ref)=>{

			const trHeaderTop = ref.current.getBoundingClientRect().top
	
			return ref.current ? [...ref.current.getElementsByTagName('tr')].reduce((t,e)=>{
				const trId = e.id
				const trDimensions = e.getBoundingClientRect()
				return {
					...t,
					[trId]: {y: trDimensions.top-trHeaderTop, height: trDimensions.height}
				}
			},{}) : {}
		}
		const newRowHeights = getRowHeights(tableRef);
		if(JSON.stringify(rowHeights)!==JSON.stringify(newRowHeights)){
			setRowHeights(newRowHeights)
		}
	}

	const {tryBubbleTransform,setBubbleSideColour,setOriginalColour,tryPerformLink,tryPerformAssociation,onRemoveLink,deleteBubble,...newProps} = props
	return (
		React.cloneElement(newProps.children,
			{...newProps,
				children: newProps.children && newProps.children.props.children,
				data: addSchedulerData(),
				columnsInfo: addSchedulerColumn(),
				cellTypes: {...newProps.cellTypes, scheduler: <SchedulerCell/>},
				tableRef: tableRef,
				onRender: ((x)=>{(newProps.onRender && newProps.onRender(x));onTableRender()}),
				onSave: ((rowId, rowValues, editableValues)=>{( props.onSave && props.onSave(rowId, rowValues, editableValues)); onSaveScheduler(rowId, rowValues, editableValues); })
			}
		)
	);
}

export default SchedulerAppender