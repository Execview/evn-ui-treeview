import React, { useState } from 'react';
import { OCO } from '@execview/reusable';
import classes from './ColorCell.module.css';


const ColorCell = (props) => {
	const [open, setOpen] = useState(false);

	const colors = { green: 'On track', amber: 'At Risk', red: 'Blocked', grey: 'Unknown Status', blue: 'Completed'};
	const text = props.data || 'grey';
	const isEditable = props.isEditable;
	const colorClasses = isEditable ? classes['solid-background-' + text] : classes['non-editable-' + text];
	const smallView = (
		<div className={classes['color-circle-container']} onClick={() => tryOpen()}>
			<div className={classes['color-circle'] + ' ' + colorClasses + ' ' + classes['small-stripes']} />
		</div>
	);

	const bigView = (
		<div className={classes['no-select'] + ' ' + classes['progress'] + ' ' + colorClasses} style={props.style} onClick={() => tryOpen()}>
			<div className={classes['progress-text']}>{colors[text]}</div>
		</div>
	);

	const tryOpen = () => { if (!open && isEditable) { setOpen(true); } };
	const submit = (newData) => {
		props.onValidateSave(newData);
		setOpen(false);	
	};

	const width = props.style.width >= 137 ? props.style.width : 137;

	const dropdown = (
		<div className={classes['color-dropdown-container']}>
			<OCO OCO={() => setOpen(false)}>
				<div className={classes['color-dropdown']} style={{ width }}>
					<ul className={classes['color-dropdown-menu']}>
						{Object.keys(colors).map(objKey => <li className={classes['color-dropdown-item'] + ' ' + classes['hover-' + objKey]} key={objKey} onClick={(e) => { e.stopPropagation(); e.preventDefault(); submit(objKey); }}>{colors[objKey]}</li>)}
					</ul>
				</div>
			</OCO>
		</div>
	);
	const display = props.style.width >= 95 ? bigView : smallView;
	return (
		!open ? display : dropdown 
	);
};

export default ColorCell;
