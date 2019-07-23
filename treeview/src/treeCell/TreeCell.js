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
	let showPointerStyle = {};
	if (props.data.nodeStatus === 'open') {
		arrow = <FontAwesomeIcon icon={downIcon} style={{fontSize:'12px'}}/>;
		showPointerStyle = {cursor: 'pointer'};
	} else if (props.data.nodeStatus === 'closed') {
		arrow = <FontAwesomeIcon icon={rightIcon} style={{fontSize:'12px'}}/>;
		showPointerStyle = {cursor: 'pointer'};
	}

	let rowSelection = '';
	if (props.data.setSelected) {
		let icon= (props.data.isSelected && <FontAwesomeIcon icon={faCircle} style={{fontSize:'10px', color:'#00CC6F'}}/>) || <FontAwesomeIcon icon={emptyCircle} style={{fontSize:'10px',color:'rgba(255,255,255,0.4)'}}/>;
		rowSelection = <div className={classes['row-selection']} onClick={props.data.setSelected}>{icon}</div>;
	}

	return (
		<div className={classes["cell-container"]} style={{...showPointerStyle}}>
			{rowSelection}
			<div className={classes["cell-text"]} onClick={props.data.toggleNode} style={{...props.style,width:props.style.width-18, minHeight: props.style.minHeight}}>	
								
				<p className={classes["tree-text"]} style={{marginLeft: 20 * props.data.depth}}>{arrow} {props.data.text}</p>					
			</div>
		</div>
	);
}

export default TreeCell;
