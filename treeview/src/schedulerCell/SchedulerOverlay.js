import React, {useState} from 'react';
import SchedulerRightClickMenu from './SchedulerRightClickMenu'
import { getNearestSnapXToDate } from '../TableColumnAppenders/schedulerFunctions'
import { getMajorStartOf, getMajorLegend } from '../TableColumnAppenders/SchedulerBehavior'
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
		:	majorLineDates.filter(d => moment(d).date() <= 7).map(d => moment(d).startOf('month').toDate())
	)

	const majorLegends = legendDates.map(md => [getNearestSnapXToDate(md, snaps), getMajorLegend(md, props.mode)])

	const majorLinesAndLegends = majorLineDates.map((d)=>[getNearestSnapXToDate(d,snaps),getMajorLegend(d, props.mode)])
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

	const drawLine = (x,offset,style) => {
		return (
			<line x1={x} y1={offset} x2={x} y2={tableHeight} style={{zIndex:-1, pointerEvents: 'none',...style}} />
		)
	}
	const drawLegend = (x,text,pos,style) => {
		return (
			<text x={x+5} y={pos-10} style={{zIndex:-1, pointerEvents: 'none',...style}}>{text}</text>
		)
	}

	const showMenu = props.contextMenu && props.contextMenu.position

	return (
		<div>
			{/* OVERLAY! */}
			<svg height={tableHeight + (showMenu?500:0)} width='100%' style={{top:'0px', left: '0px', position: "absolute",pointerEvents: 'none', zIndex:'3'}}>
				<g style={{pointerEvents: 'auto'}}>
					{links.map((l, i)=>drawLink(l,i))}
				</g>
				{showMenu && <g style={{pointerEvents: 'auto'}}>
					<SchedulerRightClickMenu {...props.contextMenu}/>  
				</g>}
			</svg>
			{/* UNDERLAY! */}
			<svg height={tableHeight + (showMenu?500:0)} width='100%' style={{top:'0px', left: '0px', position: "absolute",pointerEvents: 'none', zIndex:'1'}}>
				<g style={{pointerEvents: 'auto'}}> 
					{lines.map((x)=>drawLine(x,0,{stroke:'rgba(255,255,255,0.1)',strokeWidth:1}))}
					{majorLines.map((x)=>drawLine(x,40,{stroke:'rgba(255,255,255,0.5)',strokeWidth:2}))}
					{majorLegends.map((ll)=>drawLegend(ll[0],ll[1],tableHeight,{fontSize:30,fontWeight:300,fill:'rgba(255,255,255,0.5)'}))}
				</g>
			</svg>
		</div>
	);
}

export default SchedulerOverlay;
