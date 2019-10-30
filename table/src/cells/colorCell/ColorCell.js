import React, { useState } from 'react';
import {RightClickMenuWrapper} from '@execview/reusable';
import classes from './ColorCell.module.css';

const ColorCell = (props) => {
	const inlineMode = props.inline;
	const colors = props.colorStrings || { green: 'green', amber: 'amber', red: 'red', grey: 'grey', blue: 'blue'};
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

	const submit = (newData) => {
		props.onValidateSave(newData);
	};

	const width = props.style.width >= 137 ? props.style.width : 137;

	// const edit = (
	// 	<div className={classes['color-dropdown-container']}>
	// 		<Panel panelClass={classes["panel"]} caretClass={classes["caret"]} hideCaret={inlineMode}> 
	// 			<OCO OCO={() => setOpen(false)}>
					
	// 			</OCO>
	// 		</Panel>
	// 	</div>
	// );
	const display = props.style.width >= 95 ? bigView : smallView;


	return (
		<div style={{ height: '100%' }}>
			<div style={{ height: '100%' }}>
				{display}
			</div>
			{isEditable && <RightClickMenuWrapper onLeftClick inline={inlineMode} takeParentLocation>
				<div className={classes['color-dropdown']} style={{ width }}>
					<ul className={classes['color-dropdown-menu']}>
						{Object.keys(colors).map(objKey => <li className={classes['color-dropdown-item'] + ' ' + classes['hover-' + objKey]} key={objKey} onClick={(e) => { e.stopPropagation(); e.preventDefault(); submit(objKey); }}>{colors[objKey]}</li>)}
					</ul>
				</div>
			</RightClickMenuWrapper>}
		</div>
	);
};

export default ColorCell;
