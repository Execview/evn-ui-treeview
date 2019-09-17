import React, { useState } from 'react';
import { GenericDropdown } from '@execview/reusable';
import DefaultDropdownDisplay from './DefaultDropdownDisplay';
import Panel from '../../Panel/Panel';
import './DropdownCell.css';

const DropdownCell = (props) => {
	const [open, setOpen] = useState(false);

	const input = props.options || {};
	const optionsIsArray = Array.isArray(input);
	const inputOptions = !optionsIsArray ? input : Object.fromEntries(input.map(o => [o, o]));

	const [searchString, setSearchString] = useState('');
	const [displayedRows, setDisplayedRows] = useState(Object.keys(inputOptions));
	const inlineMode = props.inline;

	const data = props.data;

	
	const getSearchField = (key) => {
		if (props.getSearchField) {
			return props.getSearchField(key);
		}
		return key;
	};

	const onSearchChange = (value) => {
		const newRows = Object.keys(inputOptions).filter(v => getSearchField(v).toLowerCase().includes(value.toLowerCase()));
		setSearchString(value);
		setDisplayedRows(newRows);
	};

	const onBlur = () => { props.onValidateSave(props.data); setOpen(false); };

	const options = Object.fromEntries(Object.entries(inputOptions).filter(([o,op]) => displayedRows.includes(o)))
	const edit = (
		<div className="dropdown-container">
			<Panel panelClass="panel" hideCaret={inlineMode}> 
				<GenericDropdown
					{...props}
					onBlur={onBlur}
					submit={(key) => { setOpen(false); props.onValidateSave(options[key]); }}
					canSearch={props.canSearch}
					onSearchChange={onSearchChange}
					searchString={searchString}
					options={options}
					autoFocus={true}
				/>
			</Panel>
		</div>
	);

	const displayCell = props.display || <DefaultDropdownDisplay {...props} data={options[data]} looksEditable={props.isEditable} showCaret={!inlineMode} />;

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
