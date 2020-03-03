import React from 'react';
import { CircleUser, useDimensions } from '@execview/reusable';
import classes from './ImageDisplay.module.css';

const ImageDisplay = (props) => {
	const [selfRef, getDimensions] = useDimensions()
	const selfDimensions = getDimensions()
	const data = props.data || [];
	const isEditable = props.permission > 1;
	const emptyText = props.placeholder || '';
	let circlesLimit = data.length;
	let addAmount = null;
	if (selfDimensions.width - 10 < (data.length + 1) * 20) {
		circlesLimit = parseInt((selfDimensions.width - 50) / 20, 10);
		addAmount = <div className={classes['add-container']} style={{ left: ((circlesLimit + 1) * 20) + 1 }}>{'+' + (data.length - circlesLimit)}</div>;
	}
	const size = 40;

	if (data.length === 0 && isEditable) { return <div className={classes['empty-editable-container']} style={{ minHeight: size }} ><p className={classes['empty-editable']}>{emptyText}</p></div>; }
	return (
		<div ref={selfRef} className={classes['user-cell']} style={{ minHeight: size }}>
			<div className={classes['users-container']}>
				{data.slice(0, circlesLimit).reverse().map((image, index) => {
					return (
						<div className={classes['user-profile']} key={'circle' + (index + 1)} style={{ left: 20 * (circlesLimit - (index + 1)) }}>
							<CircleUser url={image} size={size} className={isEditable ? classes['cu'] : ''} />
						</div>
					);
				})}
				{addAmount}
			</div>
		</div>
	);
};

export default ImageDisplay;
