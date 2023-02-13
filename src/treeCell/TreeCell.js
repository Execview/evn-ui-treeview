import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faAngleRight, faCircle } from '@fortawesome/free-solid-svg-icons';
import { faCircle as emptyCircle } from '@fortawesome/free-regular-svg-icons';
import classes from './TreeCell.module.css';

const TreeCell = (props) => {
	const data = props.data || {}
	const style = props.style || {}

	let arrow = null
	switch(data?.nodeStatus){
		case 'open': { arrow = <FontAwesomeIcon icon={faAngleDown} style={{fontSize:'13px'}}/>; break }
		case 'closed': { arrow = <FontAwesomeIcon icon={faAngleRight} style={{fontSize:'13px'}}/>; break }
		default: {arrow = <FontAwesomeIcon icon={faAngleDown} style={{fontSize:'12px', opacity:'0'}}/>}
	}

	let rowSelection;
	if (data.setSelectedRow) {
		const icon= data.isSelected ? <FontAwesomeIcon icon={faCircle} className={classes['green-circle']} /> : <FontAwesomeIcon icon={emptyCircle} className={classes['empty-circle']} />;
		rowSelection = <div className={classes['row-selection']} >{icon}</div>;
	}
	
	const selectedBackgroundClass = data.isSelected ? classes['selected-background'] : ''

	return (
		<div className={`${classes["cell-container"]} ${selectedBackgroundClass}`} style={{minHeight: style.minHeight}} onClick={data.setSelectedRow}>
			{rowSelection}
			<div className={classes["cell-text"]} onClick={data.toggleNode} style={style}>
				<div style={{marginLeft: 20 * data.depth, marginRight: 5}}>{arrow}</div>
				<div className={classes["tree-text"]} >{data.text}</div>
			</div>
		</div>
	);
}

export default TreeCell;
