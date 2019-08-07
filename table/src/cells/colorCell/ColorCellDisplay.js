import React from 'react';
import classes from './ColorCell.module.css';

const ColorCellDisplay = (props) => {
	const colors = { green: 'On track', amber: 'At Risk', red: 'Blocked', grey: 'Unknown Status', blue: 'Completed'};
	const text = props.data || 'grey';
	const isEditable = props.isEditable;
	const colorClasses = isEditable ? classes['solid-background-' + text] : classes['non-editable-' + text];
	const smallView = (
		<div className={classes['color-circle-container']}>
			<div className={classes['color-circle'] + ' ' + colorClasses + ' ' + classes['small-stripes']} />
		</div>
	);

	const bigView = (
		<div className={classes['no-select'] + ' ' + classes['progress'] + ' ' + colorClasses} style={props.style}>
			<div className={classes['progress-text']}>{colors[text]}</div>
		</div>
	);
	
	const toRender = props.style.width >= 95 ? bigView : smallView;
	return (toRender);
}

export default ColorCellDisplay;
