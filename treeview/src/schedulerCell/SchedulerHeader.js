import React, { useEffect, useState } from 'react';
import SchedulerOverlay from './SchedulerOverlay'
import SchedulerMenu from './SchedulerMenu'
import classes from './SchedulerCell.module.css';
import { Button, OCO } from '@execview/reusable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'
 
 
const SchedulerHeader = (props) => {
	const [open, setOpen] = useState(false)
	const snaps = props.data.snaps || []

	useEffect(()=>{
		props.data.getWidth && props.data.getWidth(props.style.width)
	})
	const formatString = props.data.timeFormatString || 'DD/MM/YY'
	
	

	const timeIntervals = snaps.map((snap,index)=>{
		const diff = index !== snaps.length-1 ? Math.abs((snaps[index+1][1]-snap[1])/2) : 0;
		return <tspan alignmentBaseline="middle" key={index} x={snap[1]+diff} y={'50%'}>{moment(snap[0]).format(formatString)}</tspan>
	})
	
	return (
		<div className={classes["header-cell"]+' '+classes["no-select"]+' '+classes["scheduler-header"]} style={{width:props.style.width, touchAction: 'pan-y' }} >
			<svg height='100%' width='100%' onPointerDown={props.data.mouseOnScheduler}>
				<text style={{fill:'white', textAnchor: 'middle'}}>
				{timeIntervals}
				</text>
			</svg>
			<OCO OCO={()=>setOpen(false)}>
				<div className={classes['menu-container']}>
					<Button onClick={()=>setOpen(!open)} style={{height:'40px'}}><FontAwesomeIcon icon={faFilter}/></Button>
					{open && <SchedulerMenu {...props.data.schedulerOptions}/>}
				</div>
			</OCO>			
			<SchedulerOverlay contextMenu={props.data.contextMenu} tableHeight={props.data.tableHeight} snaps={snaps} links={props.data.links} mode={props.data.schedulerOptions.mode[0]}/>
			
		</div>
	);
}

export default SchedulerHeader;
