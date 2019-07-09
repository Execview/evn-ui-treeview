import React from 'react';
import CircleUser from '../CircleUser/CircleUser';
import classes from './ImageDisplay.module.css';

const ImageDisplay = (props) => {
	let circlesLimit = props.data.length;
	let addAmount = null;
	if (props.style.width - 10 < (props.data.length + 1) * 20) {
		circlesLimit = parseInt((props.style.width - 50) / 20, 10);
		addAmount = <div className={classes['add-container']} style={{ left: ((circlesLimit + 1) * 20) + 1 }}>{'+' + (props.data.length - circlesLimit)}</div>;
	}
	const minHeight = props.style.minHeight || 40;

	return (
		<div className={classes['user-cell']} style={{ minHeight }}>
			<div className={classes['users-container']}>
				{props.data && props.data.slice(0, circlesLimit).reverse().map((image, index) => {
					return (
						<div className={classes['user-profile']} key={'circle' + (index + 1)} style={{ left: 20 * (circlesLimit - (index + 1)) }}>
							<CircleUser url={image} size={minHeight} />
						</div>
					);
				})}
				{addAmount}
			</div>
		</div>
	);
};

export default ImageDisplay;
