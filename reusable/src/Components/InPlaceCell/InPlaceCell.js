import React, {useState, useEffect} from 'react'
import { Cell } from '@execview/table'
import classes from './Profile.module.css';

const InPlaceCell = (props) => {
	useEffect(()=>{
		setValue(props.data)
	},[props.data])

	const [value, setValue] = useState()
	const [editMode, setEditMode] = useState(false)
	const newProps = {...props,
		data:value,
		isActive: editMode,
		onValidateSave: ((data)=>{inPlaceOnValidateSave(data); props.onValidateSave(data)})
	}

	const inPlaceOnValidateSave = (data) => {
		setValue(data)
		setEditMode(false)
	}
	return ( //if you have an editor and display, or neither. extra ! are needed because ^ is bitwise, not logical.
		<div onPointerDown={(e)=>{if(!(!(props.type && props.type.editor) ^ !(props.type && props.type.display))){e.preventDefault();e.stopPropagation();setEditMode(true)}}} className={props.className}>
			<Cell {...newProps}/>
		</div>
	)
}

export default InPlaceCell