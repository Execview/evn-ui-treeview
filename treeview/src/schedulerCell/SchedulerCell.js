import React, {useLayoutEffect, useState} from 'react';
import Bubble from './Bubble';
import classes from './SchedulerCell.module.css';
import {RightClickMenuWrapper, useDimensions} from '@execview/reusable'
import SchedulerRightClickMenu from './SchedulerRightClickMenu';

const SchedulerCell = (props) => {
	const [selfRef, getSelfDimensions] = useDimensions()
	const [rowHeightAndY, setRowHeightAndY] = useState(0);
	const data = props.data || {}
	const style = props.style || {}
	const touchAction = data.shadow ? 'none' : 'pan-y'
	useLayoutEffect(()=>{
		const d = getSelfDimensions()
		const newHeightAndY = {
			height: d.height,
			y: d.y
		}
		if(JSON.stringify(newHeightAndY) !== JSON.stringify(rowHeightAndY)) {
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
