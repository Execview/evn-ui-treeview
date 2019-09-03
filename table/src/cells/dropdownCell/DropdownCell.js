import React, { useState } from 'react';
import { GenericDropdown } from '@execview/reusable';
import DefaultDropdownDisplay from './DefaultDropdownDisplay';
import Panel from '../../Panel/Panel';
import './DropdownCell.css';

const DropdownCell = (props) => {
	const [open, setOpen] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [displayedRows, setDisplayedRows] = useState(props.dropdownList || []);
	const inlineMode = props.inline;

	const data = props.data;
	const displayCell = props.display || <DefaultDropdownDisplay {...props} looksEditable={props.isEditable} showCaret={!inlineMode} />;
	

	const onSearchChange = (value) => {
		const newRows = props.dropdownList.filter(v => v.toLowerCase().includes(value));
		setSearchString(value);
		setDisplayedRows(newRows);
	};

	const onBlur = () => { props.onValidateSave(props.data); setOpen(false); };

	const options = open && displayedRows.reduce((total, option) => { return { ...total, [option]: option }; }, {})
	const edit = (
		<div className="dropdown-container">
			<Panel panelClass="panel" hideCaret={inlineMode}> 
				<GenericDropdown
					{...props}
					onBlur={onBlur}
					submit={(key) => { setOpen(false); props.onValidateSave(options[key]); }}
					onSearchChange={onSearchChange}
					searchString={searchString}
					options={options}
					autoFocus={true}
				/>
			</Panel>
		</div>
	);

	const display = (
		<div style={{ height: '100%' }} onClick={() => setOpen(true)}>
			{React.createElement(displayCell.type, { ...displayCell.props, isEditableStyles: props.isEditable, data, style: props.style })}
		</div>
	);

	if (inlineMode) {
		return (!open ? display : edit);
	}

	return (
		<div style={{ height: '100%' }}>
			<div style={{ height: '100%' }}>
				{display}
			</div>
				{open && edit}
		</div>
	);
};

export default DropdownCell;
