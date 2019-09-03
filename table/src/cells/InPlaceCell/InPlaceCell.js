import React, { useState, useEffect } from 'react';
import classes from './InPlaceCell.module.css';
import Cell from '../Cell/Cell';


const InPlaceCell = (props) => {
	const [value, setValue] = useState();

	useEffect(() => {
		setValue(props.data);
	}, [props.data]);
	
	const [editMode, setEditMode] = useState(false);

	const inPlaceOnValidateSave = (data) => {
		setValue(data);
		setEditMode(false);
	};

	const style = { border: 'none', borderRadius: '4px', ...props.style };
	const newProps = { ...props,
		data: value,
		isActive: editMode,
		style,
		onValidateSave: ((data) => { inPlaceOnValidateSave(data); props.onValidateSave(data)})
	};

	return (
		<div onPointerDown={(e) => { if(props.type && props.type.editor) { e.preventDefault(); e.stopPropagation(); setEditMode(true); } }} className={classes['default-style'] + ' ' + (props.className || '')}>
			<Cell {...newProps} />
		</div>
	)
}

export default InPlaceCell;
