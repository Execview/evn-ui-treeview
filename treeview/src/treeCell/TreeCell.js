import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle as emptyCircle } from '@fortawesome/free-regular-svg-icons';
import classes from './TreeCell.module.css';

const TreeCell = (props) => {
	const data = props.data || {}
	const downIcon = faAngleDown;
	const rightIcon = faAngleRight;
	let arrow = <FontAwesomeIcon icon={downIcon} style={{fontSize:'12px', opacity:'0'}}/>;

	const style = props.style || {}

	// var closestElement = element.closest(selectors); 
	let pointerClass = ''
	if (data.nodeStatus === 'open') {
		arrow = <FontAwesomeIcon icon={downIcon} style={{fontSize:'13px'}}/>;
		pointerClass = classes['pointer'];
	} else if (data.nodeStatus === 'closed') {
		arrow = <FontAwesomeIcon icon={rightIcon} style={{fontSize:'13px'}}/>;
		pointerClass = classes['pointer'];
	}

	let rowSelection;
	if (data.setSelectedRow) {
		let icon= data.isSelected ? <FontAwesomeIcon icon={faCircle} className={classes['green-circle']} /> : <FontAwesomeIcon icon={emptyCircle} className={classes['empty-circle']} />;
		rowSelection = <div className={classes['row-selection']} onClick={data.setSelectedRow}>{icon}</div>;
	}
	
	let selectedBackgroundClass = data.isSelected ? classes['selected-background'] : ''

	

	return (
		<div className={`${classes["cell-container"]} ${pointerClass} ${selectedBackgroundClass}`} style={{minHeight: style.minHeight}}>
			{rowSelection}
			<div className={classes["cell-text"]} onClick={data.toggleNode} style={style}>
				<div style={{marginLeft: 20 * data.depth, marginRight: 5}}>{arrow}</div>
				<div className={classes["tree-text"]} >{data.text}</div>
			</div>
		</div>
	);
}

export default TreeCell;
