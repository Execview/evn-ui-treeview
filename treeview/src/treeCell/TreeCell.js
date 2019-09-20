import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle as emptyCircle } from '@fortawesome/free-regular-svg-icons';
import classes from './TreeCell.module.css';

const TreeCell = (props) => {	
	const downIcon = faAngleDown;
	const rightIcon = faAngleRight;
	let arrow = <FontAwesomeIcon icon={downIcon} style={{fontSize:'12px', opacity:'0'}}/>;

	// var closestElement = element.closest(selectors); 
	let showPointerStyle = {minHeight: props.style.minHeight};
	let pointerClass = ''
	if (props.data.nodeStatus === 'open') {
		arrow = <FontAwesomeIcon icon={downIcon} style={{fontSize:'12px'}}/>;
		pointerClass = classes['pointer'];
	} else if (props.data.nodeStatus === 'closed') {
		arrow = <FontAwesomeIcon icon={rightIcon} style={{fontSize:'12px'}}/>;
		pointerClass = classes['pointer'];
	}

	let rowSelection = '';
	if (props.data.setSelected) {
		let icon= props.data.isSelected ? <FontAwesomeIcon icon={faCircle} className={classes['green-circle']} /> : <FontAwesomeIcon icon={emptyCircle} className={classes['empty-circle']} />;
		rowSelection = <div className={classes['row-selection']} onClick={props.data.setSelected}>{icon}</div>;
	}
	
	let selectedBackgroundClass = props.data.isSelected ? classes['selected-background'] : ''


	return (
		<div className={`${classes["cell-container"]} ${pointerClass} ${selectedBackgroundClass}`} style={{...showPointerStyle}}>
			{rowSelection}
			<div className={classes["cell-text"]} onClick={props.data.toggleNode} style={{...props.style,width:props.style.width-18}}>	
								
				<p className={classes["tree-text"]} style={{marginLeft: 20 * props.data.depth}}>{arrow} {props.data.text}</p>					
			</div>
		</div>
	);
}

export default TreeCell;
