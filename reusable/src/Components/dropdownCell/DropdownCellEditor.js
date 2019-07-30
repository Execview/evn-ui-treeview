import React, { useState } from 'react';
import GenericDropdown from '../GenericDropdown/GenericDropdown';
import './DropdownCell.css';

const DropdownCellEditor = (props) => {

	const [searchString, setSearchString] = useState('')
	const [displayedRows, setDisplayedRows] = useState(props.dropdownList || [])

	const onSearchChange = (value) => {
		const newRows = props.dropdownList.filter(v => v.toLowerCase().includes(value));
		setSearchString(value)
		setDisplayedRows(newRows)
	}

	const onBlur = () => { props.onValidateSave(props.data); }

	const options = displayedRows.reduce((total, option) => { return { ...total, [option]: option }; }, {});
	return (
		<div className="dropdown-celleditor">
			<GenericDropdown
				{...props}
				onBlur={onBlur}
				submit={key => props.onValidateSave(options[key])}
				canSearch={true}
				onSearchChange={onSearchChange}
				searchString={searchString}
				autoFocus={true}
				options={options}
			/>
		</div>
	);
}
export default DropdownCellEditor
