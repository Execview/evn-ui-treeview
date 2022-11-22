import React, {useState} from 'react';
import SchedulerRightClickMenu from './SchedulerRightClickMenu.js'
import { getNearestSnapXToDate } from '../TableColumnAppenders/schedulerFunctions.js'
import { getMajorStartOf, getMajorLegend } from '../TableColumnAppenders/SchedulerBehavior.js'
import classes from './SchedulerOverlay.module.css';
import moment from 'moment'

const SchedulerOverlay = (props) => {

	const getMajorDatesAndLegend = (dates) => {
		const majorStartOf = getMajorStartOf(props.mode)
		let majors = []
		dates.forEach(d => {
			const major = moment(d).startOf(majorStartOf).toDate().getTime()
			if(!majors.includes(major)){majors.push(major)}
		});
		return majors.map(m=>{
			const date = moment(m).toDate();
			return date
		})
	}


	const snaps = props.snaps || []
	const lines = snaps.map(snap=>snap[1])
	const majorLineDates = getMajorDatesAndLegend(snaps.map(s=>s[0]))
	const majorLines = majorLineDates.map(d=>getNearestSnapXToDate(d,snaps))
	const legendDates = (props.mode !== 'day'  
		?	majorLineDates  
		:	snaps.map(snap=>snap[0]).filter(d => moment(d).isSame(moment(d).startOf('month')))
	)
	
	const majorLegends = legendDates.map(md => [getNearestSnapXToDate(md, snaps), getMajorLegend(md, props.mode)])
	const links = props.links || []
	const tableHeight = props.tableHeight || 100

	const drawLink = (link,index)=>{
		const [fx,fy] = link.parent
		const [tx,ty] = link.child
		const [fvx,fvy] = link.parentVector
		const [tvx,tvy] = link.childVector
		let path = null
		//path = `M ${fx} ${fy} L ${tx} ${ty}` // direct line
		//path = `M ${fx} ${fy} h ${(tx-fx)/2} v ${ty-fy} h ${(tx-fx)/2}` // x-y-x line
		//path = `M ${fx} ${fy} C ${tx} ${fy} ${fx} ${ty} ${tx} ${ty}`
		path = `M ${fx} ${fy} C ${fvx} ${fvy} ${tvx} ${tvy} ${tx} ${ty}`
		//path = `M ${fx} ${fy} L ${fvx} ${fvy} L ${tvx} ${tvy} L ${tx} ${ty}`
		let pathColour ='rgb(255,255,255)'
		const drawLink = (
			<g key={index} style={{pointerEvents: 'none'}}>
				<path d={path} fill={'none'} stroke={pathColour} strokeWidth='2'/>
				<circle cx={fx} cy={fy} r="5" stroke={pathColour}  strokeWidth="2" fill="none"/>
				<circle cx={tx} cy={ty} r="5" stroke={pathColour}  strokeWidth="2" fill={pathColour}/>
			</g>)
		return drawLink

		
	}

	const drawLine = (x,offset,className) => {
		if(!typeof(x)==='number'){return}
		return (
			<line key={x+offset} x1={x} y1={offset} x2={x} y2={tableHeight} className={`${classes['markings']} ${className}`} />
		)
	}
	const drawLegend = (x,text,pos,className) => {
		if(!typeof(x)==='number'){return}
		return (
			<text key={x+text} x={x+5} y={pos-9} className={`${classes['markings']} ${className}`}>{text}</text>
		)
	}
	const weekends = snaps.filter(snap => moment(snap[0]).day() === 0 || moment(snap[0]).day() === 6)
	const testGrey = weekends.map(snap => {
		return ( <rect key={snap[1]} x={snap[1]} y="40" width="70" height={tableHeight-40} className={classes['weekend-box']} />)
	})

	return (
		<div className={props.className} style={props.style}>
			{/* OVERLAY! */}
			<svg height={tableHeight} width='100%' style={{top:'0px', left: '0px', position: "absolute",pointerEvents: 'none', zIndex:'3'}}>
				<g style={{pointerEvents: 'auto'}}>
					{links[0] && !isNaN(links[0].parent[0]) && links.map((l, i)=>drawLink(l,i))}
					
				</g>
			</svg>
			{/* UNDERLAY! */}
			<svg height={tableHeight} width='100%' style={{top:'0px', left: '0px', position: "absolute",pointerEvents: 'none', zIndex:'1'}}>
				<g style={{pointerEvents: 'auto'}}> 
					{testGrey}
					{lines.length > 0 &&  lines.map((x)=>drawLine(x,0,classes['minor-lines']))}
					{(majorLines.length > 0) && !isNaN(majorLines[0]) && majorLines.map((x)=>drawLine(x,40,classes['major-lines']))}
					{majorLegends.map((ll)=>drawLegend(ll[0],ll[1],tableHeight,classes['legend']))}
					
				</g>
			</svg>
		</div>
	);
}

export default SchedulerOverlay;
