import React, { useState } from 'react';
import classes from './InPlaceCell.module.css';
import Cell from '../Cell/Cell';


const InPlaceCell = (props) => {
	const [internalData, setInternalData] = useState(props.data)
	const [data, setData] = props.onValidateSave ? [props.data, props.onValidateSave] : [internalData, setInternalData]

	const { className, style, ...OtherCellProps } = props //OtherCellProps contains isEditable, errorText and other miscellaneous props.

	return (
		<div className={`${classes['default-style']} ${(props.className || '')}`} style={props.style}>
			<Cell data={data} onValidateSave={setData} {...OtherCellProps} />
		</div>
	)
}

export default InPlaceCell;
