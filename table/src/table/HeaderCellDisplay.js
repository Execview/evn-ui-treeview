import React from 'react';
import {useDimensions} from '@execview/reusable'

const HeaderCellDisplay = (props) => {
	const [selfRef, getDimensions] = useDimensions()
	const selfDimensions = getDimensions()
	let spans = (
		<div className="span-container">
			<span className="arrow-up" />
			<span className="arrow-down" />
		</div>
	);
	let cellWidth = selfDimensions.width > 30 ? selfDimensions.width - 30 : selfDimensions.width - 5;
	if (props.data.spans === '') {
		spans = '';
		cellWidth = selfDimensions.width - 5;
	} else if (props.data.spans !== 'both') {
		spans = (
			<div className="span-container">
				<span className={props.data.spans} />
			</div>
		);
	}

	return (
		<div ref={selfRef} className="header-cell no-select" onClick={props.data.sortData}>
			{spans}
			<div className="thead-container" style={{ width:  isNaN(cellWidth) ? 'auto' : cellWidth }}>{props.data.title}</div>
		</div>
	);
}

export default HeaderCellDisplay
