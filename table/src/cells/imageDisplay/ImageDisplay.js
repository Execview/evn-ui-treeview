import React from 'react';
import { CircleUser } from '@execview/reusable';
import classes from './ImageDisplay.module.css';

const ImageDisplay = (props) => {
	const data = props.data || [];
	const isEditable = props.isEditable;
	const emptyText = props.placeholder || '';
	let circlesLimit = data.length;
	let addAmount = null;
	if (props.style.width - 10 < (data.length + 1) * 20) {
		circlesLimit = parseInt((props.style.width - 50) / 20, 10);
		addAmount = <div className={classes['add-container']} style={{ left: ((circlesLimit + 1) * 20) + 1 }}>{'+' + (data.length - circlesLimit)}</div>;
	}
	const minHeight = props.style.minHeight || 40;

	if (data.length===0 && props.isEditable) { return <div className={classes['empty-editable-container']} style={{ minHeight }} ><p className={classes['empty-editable']}>{emptyText}</p></div>; }
	return (
		<div className={classes['user-cell']} style={{ minHeight }}>
			<div className={classes['users-container']}>
				{data.slice(0, circlesLimit).reverse().map((image, index) => {
					return (
						<div className={classes['user-profile']} key={'circle' + (index + 1)} style={{ left: 20 * (circlesLimit - (index + 1)) }}>
							<CircleUser url={image} size={minHeight} className={isEditable ? classes['cu'] : ''} />
						</div>
					);
				})}
				{addAmount}
			</div>
		</div>
	);
};

export default ImageDisplay;
