import React, { useEffect, useState } from 'react';
import SchedulerOverlay from './SchedulerOverlay'
import SchedulerMenu from './SchedulerMenu'
import classes from './SchedulerCell.module.css';
import { Button, OCO } from '@execview/reusable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilter } from '@fortawesome/free-solid-svg-icons';
 
 
const SchedulerHeader = (props) => {
	const [open, setOpen] = useState(false) 
	useEffect(()=>{
		props.data.getWidth && props.data.getWidth(props.style.width)
	})

	let days = props.data.snaps.map((snap,index)=>{return <tspan alignmentBaseline="middle" key={index} x={snap[1]} y={'50%'}>{snap[0].getDate()+"/"+(snap[0].getMonth()+1)}</tspan>})
	return (
		<div className={classes["header-cell"]+' '+classes["no-select"]+' '+classes["scheduler-header"]} style={{width:props.style.width, touchAction: 'pan-y' }} onPointerDown={props.data.mouseOnScheduler}>
			<svg height='100%' width='100%'>
				<text style={{fill:'white'}} >{days}</text>
			</svg>
			<OCO OCO={()=>setOpen(true)}>
				<Button onClick={()=>setOpen(!open)} style={{height:'36px'}}><FontAwesomeIcon icon={faFilter}/></Button>
				{open && <SchedulerMenu/>}
			</OCO>			
			<SchedulerOverlay contextMenu={props.data.contextMenu} tableHeight={props.data.tableHeight} links={props.data.links}/>
			
		</div>
	);
}

export default SchedulerHeader;
