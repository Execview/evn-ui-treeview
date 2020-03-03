import React, { useState } from 'react';
import {RightClickMenuWrapper, useDimensions} from '@execview/reusable';
import classes from './ColorCell.module.css';

const ColorCell = (props) => {
	const [selfRef, getDimensions] = useDimensions()
	const selfDimensions = getDimensions()
	const [open, setOpen] = useState(false)
	const inlineMode = props.inline;
	const colors = props.colorStrings || { green: 'green', amber: 'amber', red: 'red', grey: 'grey', blue: 'blue'};
	const text = props.data || 'grey';
	const isEditable = props.permission > 1;
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
		setOpen(false)
		props.onValidateSave(newData);
	};

	const width = selfDimensions.width >= 137 ? selfDimensions.width : 137;

	const display = selfDimensions.width >= 95 ? bigView : smallView;


	return (
		<div ref={selfRef} style={{ height: '100%' }}>
			<div style={{ height: '100%' }}>
				{display}
			</div>
			{isEditable && <RightClickMenuWrapper onLeftClick inline={inlineMode} takeParentLocation open={open} setOpen={setOpen} rightClickMenuStyle={{width}} {...props.rightClickMenuWrapperProps}>
				<div className={classes['color-dropdown']}>
					<ul className={classes['color-dropdown-menu']}>
						{Object.keys(colors).map(objKey => (
							<li 
								className={classes['color-dropdown-item'] + ' ' + classes['hover-' + objKey]}
								key={objKey}
								onClick={(e) => { e.stopPropagation(); e.preventDefault(); submit(objKey); }}
							>
								{colors[objKey]}
							</li>
						))}
					</ul>
				</div>
			</RightClickMenuWrapper>}
		</div>
	);
};

export default ColorCell;
