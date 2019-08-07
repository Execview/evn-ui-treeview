import React, {useState, useEffect } from 'react';
import Cell from '../Cell/Cell';
import classes from './InPlaceCell.module.css';

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

	const style = { padding: '5px', paddingRight: '15px', textAlign: 'left', border: 'none', borderRadius: '4px', fontSize: '25px', ...props.style };
	const newProps = { ...props,
		data: value,
		isActive: editMode,
		style,
		onValidateSave: ((data) => { inPlaceOnValidateSave(data); props.onValidateSave(data)})
	};

	
	return ( //if you have an editor and display, or neither. extra ! are needed because ^ is bitwise, not logical.
		<div onPointerDown={(e) => { if (!(!(props.type && props.type.editor) ^ !(props.type && props.type.display))) { e.preventDefault(); e.stopPropagation(); setEditMode(true); } }} className={classes['default-style'] + ' ' + (props.className || '')}>
			<Cell {...newProps} />
		</div>
	)
}

export default InPlaceCell;
