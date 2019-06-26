import React, { useState } from 'react';
import './GenericAssignDisplay.css';
import { GenericDropdown } from '@execview/reusable';
import { isMobile } from 'react-device-detect';

const AddRole = (props) => {
	const roles = ['Project Manager', 'Peasant', 'Wizard', 'Jester', 'Drunkard', 'Damsel', 'Dovahkiin FUS-RO-DAH'];
	const [searchString, setSearchString] = useState('');
	const [displayedRows, setDisplayedRows] = useState(roles);

	const onSearchChange = (value) => {
		const newRows = roles.filter(v => v.toLowerCase().includes(value.toLowerCase()));
		setSearchString(value);
		setDisplayedRows(newRows);
	};

	const submitExtra = (role) => {
		props.submit(props.id, role);
	};

	return (
		<div>
			<GenericDropdown
				options={displayedRows.reduce((total, role) => { return { ...total, [role]: role }; }, {})}
				submit={submitExtra}
				searchString={searchString}
				onSearchChange={onSearchChange}
				canSearch={true}
				autoFocus={!isMobile}
				placeholder="Assign a role..."
				style={{ color: 'white' }}
			/>
		</div>
	);
};

export default AddRole;

