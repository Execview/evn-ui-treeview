import React, { useState, useEffect } from 'react';
import { GenericDropdown, RightClickMenuWrapper } from '@execview/reusable';
import DefaultDropdownDisplay from './DefaultDropdownDisplay';
import classes from './DropdownCell.module.css';

const DropdownCell = (props) => {
	const [open, setOpen] = useState(false)
	const input = props.options || {};
	const optionsIsArray = Array.isArray(input);
	const inputOptions = !optionsIsArray ? input : Object.fromEntries(input.map(o => [o, o]));

	const [searchString, setSearchString] = useState('');
	const [displayedRows, setDisplayedRows] = useState(Object.keys(inputOptions));
	useEffect(()=>onSearchChange(searchString),[props.options])

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

	const onBlur = () => { props.onValidateSave(props.data); setOpen(false) };

	const options = Object.fromEntries(Object.entries(inputOptions).filter(([o,op]) => displayedRows.includes(o)))

	const displayCell = props.display || <DefaultDropdownDisplay {...props} data={options[data]} looksEditable={props.isEditable} showCaret={!inlineMode} />;

	const display = (
		<div style={{ height: '100%' }}>
			{React.createElement(displayCell.type, {  data, ...displayCell.props, isEditableStyles: props.isEditable, style: props.style })}
		</div>
	);

	const {style,... rest} = props;

	return (
		<div style={{ height: '100%' }}>
			<div style={{ height: '100%' }}>
				{display}
			</div>
			<RightClickMenuWrapper onLeftClick inline={inlineMode} takeParentLocation open={open} setOpen={setOpen} rightClickMenuStyle={style} rightClickMenuClassName={classes['rcm']} {...props.rightClickMenuWrapperProps}>
				<GenericDropdown
					{...rest}
					onBlur={onBlur}
					submit={(key) => { props.onValidateSave(key); if(!props.dontCloseOnClick){setOpen(false)} }}
					canSearch={props.canSearch}
					onSearchChange={onSearchChange}
					searchString={searchString}
					options={options}
					autoFocus={true}
					genericDropdownClasses={{dropdown: classes['dropdown'], dropdownMenu: classes['dropdown-menu']}}
				/>
			</RightClickMenuWrapper>
		</div>
	);
};

export default DropdownCell;
