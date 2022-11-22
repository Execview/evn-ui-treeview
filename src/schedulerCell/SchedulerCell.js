import React, {useEffect, useLayoutEffect, useState} from 'react';
import Bubble from './Bubble.js';
import classes from './SchedulerCell.module.css';
import {RightClickMenuWrapper, useDimensions} from '@execview/reusable'
import SchedulerRightClickMenu from './SchedulerRightClickMenu.js';

const SchedulerCell = (props) => {
	const [selfRef, getSelfDimensions] = useDimensions()
	const [rowHeightAndY, setRowHeightAndY] = useState({});
	const [internalId, setInternalId] = useState() //sometimes the same cell can be used for a different bubble (i.e the props/data change but the reference doesnt)
	const data = props.data || {}
	const style = props.style || {}
	const touchAction = data.shadow ? 'none' : 'pan-y'

	useLayoutEffect(()=>{
		const requiresRecalculation = data?.bkey!==internalId
		if(requiresRecalculation){setInternalId(data?.bkey)}		
		const d = getSelfDimensions()
		const newHeightAndY = {
			height: d.height,
			y: d.y
		}

		if(requiresRecalculation || (newHeightAndY.y && newHeightAndY.height && (JSON.stringify(newHeightAndY) !== JSON.stringify(rowHeightAndY)))) {
			setRowHeightAndY(newHeightAndY)
			data.setHeightAndY && data.setHeightAndY(newHeightAndY)
		}
	})

	return (
		<div ref={selfRef} className={classes["cell-container"]} style={{minHeight: style.minHeight,touchAction:touchAction, userSelect: 'none'}}>
			<RightClickMenuWrapper open={data.rightClickMenuOptions.open} setOpen={data.rightClickMenuOptions.setOpen}>
				<SchedulerRightClickMenu {...data.rightClickMenuOptions}/>
			</RightClickMenuWrapper>
			<svg onPointerDown={data.mouseOnScheduler} style={{position:'absolute', height:'100%', width: '100%', filter: data.shadow?"drop-shadow(-2px -2px 13px "+data.colour+")":""}}>
				<Bubble
					{...data}
				/>
			</svg>
		</div>
	);
}

export default SchedulerCell;
