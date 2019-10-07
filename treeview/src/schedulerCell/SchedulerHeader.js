import React, { useEffect, useState } from 'react';
import SchedulerOverlay from './SchedulerOverlay'
import SchedulerMenu from './SchedulerMenu'
import classes from './SchedulerHeader.module.css';
import { Button, OCO } from '@execview/reusable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'

const SchedulerHeader = (props) => {
	const [open, setOpen] = useState(false)
	const snaps = props.data.snaps || []
	const style = props.style || {}

	const [tableRefCurrent, setTableRefCurrent] = useState(null)
	useEffect(()=>{
		if(props.data.tableRef){
			setTableRefCurrent(props.data.tableRef.current)
		}
	},[props.data.tableRef])
	
	const tableHeight = tableRefCurrent ? tableRefCurrent.getBoundingClientRect().height : 0

	useEffect(()=>{
		props.data.getWidth && props.data.getWidth(style.width)
	})

	const formatString = props.data.timeFormatString || 'DD/MM/YY'
	
	const timeIntervals = snaps.map((snap,index)=>{
		const diff = index !== snaps.length-1 ? Math.abs((snaps[index+1][1]-snap[1])/2) : 0;
		if (index === snaps.length - 1) {return '';}
		let strings = moment(snap[0]).format(formatString).split(' ')
		if(strings.length===1){strings = ['',...strings]}
		const greyString = strings[0]
		const otherStrings = ' '+strings.slice(1,strings.length).join(' ')
		return (
			<tspan className={classes['edge-bad']} alignmentBaseline="middle" key={index} x={snap[1]+diff} y={'50%'}>
				.
				<tspan className={classes['grey-text']} alignmentBaseline="middle">{greyString}</tspan>
				<tspan className={classes['white-text']} alignmentBaseline="middle">{otherStrings}</tspan>
			</tspan>
		)
	})

	return (
		<div className={`${classes["header-cell"]} ${classes["no-select"]} ${classes["scheduler-header"]}`} style={{touchAction: 'pan-y' }} >
			<svg height='100%' width='100%' onPointerDown={props.data.mouseOnScheduler}>
				<text className={classes['header-text']}>
				{timeIntervals}
				</text>
			</svg>
			<OCO OCO={()=>setOpen(false)}>
				<div className={classes['menu-container']}>
					<Button onClick={()=>setOpen(!open)} style={{height:'40px'}}><FontAwesomeIcon icon={faChevronDown}/></Button>
					{open && <SchedulerMenu {...props.data.schedulerOptions}/>}
				</div>
			</OCO>			

			<SchedulerOverlay contextMenu={props.data.contextMenu} tableHeight={tableHeight} snaps={snaps} links={props.data.links} mode={props.data.schedulerOptions.mode[0]}/>
		
			
		</div>
	);
}

export default SchedulerHeader;
