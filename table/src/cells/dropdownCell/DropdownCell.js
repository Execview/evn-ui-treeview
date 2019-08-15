import React, { useState } from 'react';
import { GenericDropdown } from '@execview/reusable';
import TextCell from '../TextCell/TextCell';
import './DropdownCell.css';

const DropdownCell = (props) => {
	const [open, setOpen] = useState(false);
	const [searchString, setSearchString] = useState('');
	const [displayedRows, setDisplayedRows] = useState(props.dropdownList || []);

	const data = props.data;
	const displayCell = props.display || <TextCell {...props} />;

	const onSearchChange = (value) => {
		const newRows = props.dropdownList.filter(v => v.toLowerCase().includes(value));
		setSearchString(value);
		setDisplayedRows(newRows);
	};

	const onBlur = () => { props.onValidateSave(props.data); setOpen(false); };

	const options = displayedRows.reduce((total, option) => { return { ...total, [option]: option }; }, {});
	const edit = (
		<div className="dropdown-container">
			<div className="dropdown-celleditor">
				<GenericDropdown
					{...props}
					onBlur={onBlur}
					submit={(key) => { setOpen(false); props.onValidateSave(options[key]); }}
					canSearch={true}
					onSearchChange={onSearchChange}
					searchString={searchString}
					autoFocus={true}
					options={options}
				/>
			</div>
		</div>
	);

	const display = (
		<div style={{ height: '100%' }} onClick={() => setOpen(true)}>
			{React.createElement(displayCell.type, { ...displayCell.props, isEditable: props.isEditable, data, style: props.style })}
		</div>
	);

	return (!open ? display : edit);
};

export default DropdownCell;
