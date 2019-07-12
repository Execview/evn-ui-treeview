import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import classes from './TreeCell.module.css';

const TreeCell = (props) => {	
	const downIcon = faAngleDown
	const rightIcon = faAngleRight
	let arrow = <FontAwesomeIcon icon={downIcon} style={{width:'10px', opacity:'0'}}/>;

	// var closestElement = element.closest(selectors); 
	let showPointerStyle = {};
	if (props.data.nodeStatus === 'open') {
		arrow = <FontAwesomeIcon icon={downIcon} style={{width:'10px'}}/>
		showPointerStyle = {cursor: 'pointer'};
	} else if (props.data.nodeStatus === 'closed') {
		arrow = <FontAwesomeIcon icon={rightIcon} style={{width:'10px'}}/>
		showPointerStyle = {cursor: 'pointer'};
	}
	return (
		<div className={classes["cell-container"]} onClick={props.data.toggleNode} style={showPointerStyle}>
			<div style={{...props.style,width:props.style.width - 10, minHeight: props.style.minHeight - 10}} className={classes["cell-text"]}>										
				<p className={classes["tree-text"]} style={{marginLeft: 20 * props.data.depth}}>{arrow} {props.data.text}</p>					
			</div>
		</div>
	);
}

export default TreeCell;
