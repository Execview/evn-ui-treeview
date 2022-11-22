import React, { useEffect } from 'react';
import { useDimensions } from '@execview/reusable'
import SchedulerOverlay from './SchedulerOverlay.js'
import SchedulerMenu from './SchedulerMenu.js'
import classes from './SchedulerHeader.module.css';
import { Button, RightClickMenuWrapper } from '@execview/reusable'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import moment from 'moment'

const SchedulerHeader = (props) => {
	const data = props.data || {}
	const snaps = data.snaps || []
	const [selfRef, getSelfDimensions] = useDimensions()

	const tableHeight = (data.getTableDimensions && data.getTableDimensions().height) || 0

	useEffect(()=>{
		data.setWidth && data.setWidth(getSelfDimensions().width)
	})

	const formatString = data.timeFormatString || 'DD/MM/YY'
	
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
		<div ref={selfRef} className={`${classes["header-cell"]} ${classes["no-select"]} ${classes["scheduler-header"]}`} style={{touchAction: 'pan-y' }} >
			<svg height='100%' width='100%' onPointerDown={props.data.mouseOnScheduler}>
				<text className={classes['header-text']}>
				{timeIntervals}
				</text>
			</svg>
			<div className={classes['menu-container']}>
				<Button style={{height:'40px'}}><FontAwesomeIcon icon={faChevronDown}/></Button>
				<RightClickMenuWrapper onLeftClick takeParentLocation moveBox={[27,0]}>
					<SchedulerMenu {...props.data.schedulerOptions}/>
				</RightClickMenuWrapper>
			</div>
			<SchedulerOverlay tableHeight={tableHeight} snaps={snaps} links={props.data.links} mode={props.data.schedulerOptions.mode[0]}/>
		</div>
	);
}

export default SchedulerHeader;
