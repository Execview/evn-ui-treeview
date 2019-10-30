import React, { useState } from 'react';
import { GenericDropdown, RightClickMenuWrapper } from '@execview/reusable';
import DefaultDropdownDisplay from './DefaultDropdownDisplay';
import './DropdownCell.css';

const DropdownCell = (props) => {
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

	const onBlur = () => { props.onValidateSave(props.data); };

	const options = Object.fromEntries(Object.entries(inputOptions).filter(([o,op]) => displayedRows.includes(o)))
	// const edit = (
	// 	<div className="dropdown-container">
	// 		<Panel panelClass="panel" hideCaret={inlineMode}> 
				
	// 		</Panel>
	// 	</div>
	// );

	const displayCell = props.display || <DefaultDropdownDisplay {...props} data={options[data]} looksEditable={props.isEditable} showCaret={!inlineMode} />;

	const display = (
		<div style={{ height: '100%' }}>
			{React.createElement(displayCell.type, { ...displayCell.props, isEditableStyles: props.isEditable, data, style: props.style })}
		</div>
	);

	return (
		<div style={{ height: '100%' }}>
			<div style={{ height: '100%' }}>
				{display}
			</div>
			<RightClickMenuWrapper onLeftClick inline={inlineMode} takeParentLocation>
				<GenericDropdown
					{...props}
					onBlur={onBlur}
					submit={(key) => { props.onValidateSave(options[key]); }}
					canSearch={props.canSearch}
					onSearchChange={onSearchChange}
					searchString={searchString}
					options={options}
					autoFocus={true}
				/>
			</RightClickMenuWrapper>
		</div>
	);
};

export default DropdownCell;
