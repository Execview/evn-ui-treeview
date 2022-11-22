import React, { useState, useEffect, useReducer } from 'react';
import SchedulerCell from '../schedulerCell/SchedulerCell.js'
import SchedulerHeader from '../schedulerCell/SchedulerHeader.js';
import { injectObjectInObject, useDimensions } from '@execview/reusable';

import { getDrawnLinksFromData, getSnaps, getTimeFormatString, getMajorStartOf, getBubbleColours } from './SchedulerBehavior.js'
import { getColourFromMap } from './BubbleBehavior.js'
import {getNearestSnapXToDate, getInternalMousePosition, getNearestSnapDateToX, getExactNearestSnapDateToX, getYPositionFromRowId} from './schedulerFunctions.js'
import { UNSATColours, Lightcolours, Darkcolours, testColours } from './colourOptions.js'


import { fromEvent, merge } from 'rxjs';
var moment = require('moment')

const mousepositionstream = merge(fromEvent(document,'pointermove'),fromEvent(document,'pointerdown'))

const useScheduler = (data, columnsInfo, options={}, active=true) => {
	const [initialised, setInitialised] = useState(false)
	const tableRef = options.tableRef
	const onSave = options.onSave
	const colours = options.colours || UNSATColours
	const rowHeight = options.height || 30
	const timeWidth = options.timeWidth || 70
	const initialSchedulerResolution = options.resolution || 'day';
	const initialStartDate = options.start || new Date()
	const tryPerformLink = options.tryPerformLink
	const tryPerformAssociation = options.tryPerformAssociation
	const onMouseUp = options.onMouseUp
	const schedulerOptions = options.schedulerOptions
	const onRemoveLink = options.onRemoveLink
	const deleteBubble = options.deleteBubble
	const bubbleHeight = rowHeight*0.9
	
	const [tableRefCopy, getTableDimensions] = useDimensions({ref: tableRef})
	const columnName = 'scheduler'

	const HIGHLIGHT_COLOUR = 'Grey'

	const [rowHeights, setRowHeights] = useReducer((rhs,{id,heightAndY})=>({...rhs,[id]:heightAndY}),[])
	useReducer()
	const [schedulerWidth, setSchedulerWidth] = useState(0)

	const [bubbleContextMenuKey, setBubbleContextMenuKey] = useState(null)
	const [mouseDownOnBubble, setMouseDownOnBubble] = useState({key:'',location:'',dragDiffs:[0,0]})
	const [mouseDownOnScheduler, setMouseDownOnScheduler] = useState(null)

	useEffect(()=>{
		if(!initialised && data && Object.keys(data).length!==0){
			const allStartDates = Object.keys(data).map(key=>data[key].startdate).filter(sd=>!isNaN(sd))
			if(allStartDates.length > 0) {
				const newStartDate =  new Date(Math.min(...allStartDates))
				setInitialised(true)
				setSchedulerStart(newStartDate)
			}
		}
	},[data])

	const getShiftedStart = (d,r) => {
		// EXPERIMENTAL -- deals with all the snaps being on sunday. REMOVE WHEN STUFF WORKS PROPERLY
		if (r === 'week') {
			return moment(d).startOf(r).day(5).toDate()
		}
		return moment(d).startOf(r).toDate()
	}

	const [schedulerStart, actuallySetSchedulerStart] = useState(initialStartDate)
	const [schedulerResolution, actuallySetSchedulerResolution] = useState(initialSchedulerResolution)

	const setSchedulerStart = (date) => {
		const d = getShiftedStart(date,schedulerResolution)
		
		actuallySetSchedulerStart(d)
	}
	
	const setSchedulerResolution = (res) => {
		actuallySetSchedulerResolution(res)
		actuallySetSchedulerStart(getShiftedStart(schedulerStart,res))
	}	

	const extrasnaps = 0 //Math.ceil(schedulerWidth/timeWidth)

	const colourChanges = {
		SET_SIDE_COLOUR:'SET_SIDE_COLOUR',
		REMOVE_COLOUR_OVERRIDE:'REMOVE_COLOUR_OVERRIDE'
	}
	const colourChangeReducer = (co,a) =>{
		switch (a.type) {
			case colourChanges.SET_SIDE_COLOUR: {return {...co, [a.id]:{...co[a.id],[a.side]:a.colour}}}
			case colourChanges.REMOVE_COLOUR_OVERRIDE: {
				const {[a.id]:_, ...rest} = co
				return rest
			}
			default: return co
		}
	}
	const [colourOverrides, dispatchColourChange] = useReducer(colourChangeReducer,{})
	const setSideColour = (id, side, colour) => dispatchColourChange({type: colourChanges.SET_SIDE_COLOUR, id, side, colour})
	const removeColourOverride = (id) => dispatchColourChange({type: colourChanges.REMOVE_COLOUR_OVERRIDE, id})

	const canOpenRightClickMenu = (key) => {
		return data[key].meta && data[key].meta.permission>1
	}

	const getEditableBubbleSides = (key) => {
		let editableSides = (data[key].meta && data[key].meta.permission>1 && ['left','right']) || []
		if(editableSides && editableSides.includes('left') && editableSides.includes('right')){editableSides.push('middle')}
		return editableSides
	}
	const isBubbleSideEditable = (key,side) => {
		const editableSides = getEditableBubbleSides(key)
		return editableSides ? editableSides.includes(side) : false
	}	

	const snaps = getSnaps(schedulerStart, schedulerResolution, schedulerWidth, timeWidth, extrasnaps)

	//#region Mouse Interactions
	const bubbleclickdown = (key,event,side)=>{
		if(!isBubbleSideEditable(key,side)){return}
		setMouseDownOnBubble({key:key, location:side, dragDiffs:[0,0]})
		setSideColour(key,side,HIGHLIGHT_COLOUR)
	}

	const bubblemiddleclickdown = (key,event,side)=>{
		if(!isBubbleSideEditable(key,side)){return}
		const mousedownpos = getInternalMousePosition(event)
		const dragDiffs =[
			mousedownpos[0]-getNearestSnapXToDate(data[key].startdate,snaps),
			mousedownpos[0]-getNearestSnapXToDate(data[key].enddate,snaps)
		]
		setMouseDownOnBubble({key, location:side, dragDiffs})
	}

	const bubbleclickup = (key,event,side)=>{
		if(!isBubbleSideEditable(key,side)){return}
		if(key !== mouseDownOnBubble.key){
			tryPerformLink(key, mouseDownOnBubble.key, side, mouseDownOnBubble.location);
		}
		removeColourOverride(key)
	}
	const bubblemiddleclickup = (key,event, side)=>{
		if(!isBubbleSideEditable(key,side)){return}
		if(!['left','right'].includes(mouseDownOnBubble.location) && key!==mouseDownOnBubble.key){
			//tryPerformAssociation(key, mouseDownOnBubble.key);
		}
		removeColourOverride(key)
	}

	const bubblemousein = (key, event, side)=>{if(	event.buttons!==0 && mouseDownOnBubble.key!==key && mouseDownOnBubble.location!=='middle'){
		if(!isBubbleSideEditable(key,side)){return}
		setSideColour(key, side, HIGHLIGHT_COLOUR)}
	}
	const bubblemiddlemousein = (key,event,side)=>{if(event.buttons!==0 && mouseDownOnBubble.key!==key && mouseDownOnBubble.location==='middle'){
		if(!isBubbleSideEditable(key,side)){return}
		//setSideColour(data[key].colours.original, 'middle', HIGHLIGHT_COLOUR)}
	}}
	
	const bubblemouseout = (key,event, side)=>{if(event.buttons!==0 && mouseDownOnBubble.key!==key && mouseDownOnBubble.location!=='middle'){
		if(!isBubbleSideEditable(key,side)){return}
		removeColourOverride(key)}}
	const bubblemiddlemouseout = (key,event,side)=>{if(event.buttons!==0 && mouseDownOnBubble.key!==key && mouseDownOnBubble.location==='middle'){
		if(!isBubbleSideEditable(key,side)){return}
		removeColourOverride(key);
		removeColourOverride(mouseDownOnBubble.key)}}

	const bubbleOnContextMenu = (key,event)=>{
		event.preventDefault();
		if(!canOpenRightClickMenu(key)){return}
		setBubbleContextMenuKey(key);
	}

	const mouseEvent = (event) => {
		const key = mouseDownOnBubble.key
		if(key && !data[key]){return}
		if(mouseDownOnScheduler){event.preventDefault()}
		var mouse = getInternalMousePosition(event)
		var bubble=data[key];
		if(event.buttons===0) {
			if(key){
				onMouseUp && onMouseUp()
				removeColourOverride(key)
				setMouseDownOnBubble({key:'',location:'',dragDiffs:[0,0]})
			}
		}
		if(['left','right','middle'].includes(mouseDownOnBubble.location)){
			const nearestDateToX = getNearestSnapDateToX(mouse[0] - mouseDownOnBubble.dragDiffs[0],snaps)
			let potentialStart = nearestDateToX
			let potentialEnd = nearestDateToX

			const startChanged = Math.abs(potentialStart.getTime()-data[key].startdate.getTime())!==0
			const endChanged = Math.abs(potentialEnd.getTime()-data[key].enddate.getTime())!==0
			
			//EXPERIMENTAL -- use when using the move that doesn't snap
			// potentialStart = new Date(potentialStart.getFullYear(),potentialStart.getMonth(),potentialStart.getDate(),potentialStart.getHours())
			// potentialEnd = new Date(potentialEnd.getFullYear(),potentialEnd.getMonth(),potentialEnd.getDate(),potentialEnd.getHours())

			switch(mouseDownOnBubble.location){
				case 'left': {
					if(mouseDownOnBubble.location==='left' && !event.shiftKey && startChanged){
						onSave(key, columnName, {startdate: potentialStart})
					}
					break;
				}
				case 'right': {
					if(mouseDownOnBubble.location==='right' && !event.shiftKey && endChanged){
						onSave(key, columnName, {enddate: potentialEnd })
					}
					break;
				}
				case 'middle': {
					if(mouseDownOnBubble.location==='middle' && !event.shiftKey && startChanged){
						onSave(key, columnName, {
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

	useEffect(()=>{
		const mouseSubscription = mousepositionstream.subscribe((event)=>mouseEvent && mouseEvent(event))
		return ()=>{mouseSubscription.unsubscribe()}
	})

	const clickedOnScheduler = (event) => {
		if(!mouseDownOnBubble.key) {
			const mouse = getInternalMousePosition(event)
			const XDownDate = getNearestSnapDateToX(mouse[0],snaps)
			setMouseDownOnScheduler(XDownDate)
		}
	}
	//#endregion


	const addSchedulerColumn = () => {
		const schedulerheaderdata = {
			snaps: snaps,
			getTableDimensions: getTableDimensions,
			links: getDrawnLinksFromData(
				data,
				id=>getYPositionFromRowId(id,rowHeights,getTableDimensions().y)+(((rowHeights[id] || {}).height || 0)/2),
				bubbleDate=>getNearestSnapXToDate(bubbleDate,snaps)
			),
			setWidth: ((w)=>{if(w!==schedulerWidth){setSchedulerWidth(w)}}),
			mouseOnScheduler: clickedOnScheduler,
			timeFormatString: getTimeFormatString(schedulerResolution),
			// contextMenu: ,
			schedulerOptions: {
				mode: [schedulerResolution,((r)=>setSchedulerResolution(r))],
				start: [schedulerStart, ((date)=>setSchedulerStart(date))]
			}
		}
		let {position, ...otherSchedulerOptions} = schedulerOptions || {};
		const newColumn = {[columnName]: {...columnsInfo[columnName], cellType: <SchedulerCell style={{minHeight: rowHeight}}/>,headerType: <SchedulerHeader data={schedulerheaderdata}/>, ...otherSchedulerOptions}};
		position = position || 'end';
		
		return injectObjectInObject(columnsInfo, newColumn, position)
	}

	const addSchedulerData = () => {
		let tableData = {...data}
		for(const rowId in tableData ){
			const shadow = rowId===mouseDownOnBubble.key ? true : false
			const bubbleColours = getBubbleColours(rowId, tableData, colourOverrides)
			tableData[rowId] = {...tableData[rowId],
				[columnName]:{
					//Bubble Data
					bkey: rowId,
					startpoint: tableData[rowId].startdate ? [getNearestSnapXToDate(tableData[rowId].startdate,snaps),0] : [0,0],
					endpoint: tableData[rowId].enddate ? [getNearestSnapXToDate(tableData[rowId].enddate,snaps),bubbleHeight] : [0,0],
					colour: getColourFromMap(bubbleColours.middle,colours),
					leftcolour: getColourFromMap(bubbleColours.left,colours),
					rightcolour: getColourFromMap(bubbleColours.right,colours),
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
					text: tableData[rowId].startdate && tableData[rowId].enddate && tableData[rowId].name || '',
					shadow: shadow,
					mouseOnScheduler: clickedOnScheduler,
					shape: tableData[rowId].shape,
					editableSides: getEditableBubbleSides(rowId),
					rightClickMenuOptions: {
						open: bubbleContextMenuKey===rowId,
						setOpen: (newState)=>{newState ? setBubbleContextMenuKey(bubbleContextMenuKey) : setBubbleContextMenuKey(null)},
						options: {
							removeLink: <div onClick={()=>{onRemoveLink(bubbleContextMenuKey)}}>Remove Link</div>, 
							deleteBubble: <div onClick={()=>{deleteBubble(bubbleContextMenuKey)}}>Delete Bubble</div> 
						}
					},
					setHeightAndY: ((newHeightAndY)=>{
						// rowHeights[rowId]=newHeightAndY; setRowHeights({...rowHeights})
						// console.log(`setting ${rowId}: y: ${rowHeights[rowId]?.y} ->  ${newHeightAndY?.y} & h:${rowHeights[rowId]?.height} ->  ${newHeightAndY?.height}`)
						setRowHeights({id: rowId, heightAndY: newHeightAndY})
					})
				}
			}
		}
		return tableData
	}
	if(!active){return [data, columnsInfo, tableRefCopy]}
	return [addSchedulerData(), addSchedulerColumn(), tableRefCopy]
}

export default useScheduler