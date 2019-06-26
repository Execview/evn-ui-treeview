import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { isMobile } from 'react-device-detect';
import { TripleFill, GenericDropdown } from '@execview/reusable';
import './GenericAssignDisplay.css';

const AddGenericDropDown = (props) => {
	const nonAssignedUsers = Object.keys(props.allItems).filter(e => !props.items.includes(e)).reduce((t, i) => { return { ...t, [i]: props.allItems[i] }; }, {});
	const [searchString, setSearchString] = useState('');
	const [displayedRows, setDisplayedRows] = useState(nonAssignedUsers);
	const [addItems, setAddItems] = useState([]);

	const onSearchChange = (value) => {
		const newRows = Object.keys(nonAssignedUsers).filter(u => nonAssignedUsers[u].name.toLowerCase().includes(value.toLowerCase())).reduce((t, u) => { return { ...t, [u]: nonAssignedUsers[u] }; }, {});
		setSearchString(value);
		setDisplayedRows(newRows);
	};

	const userClicked = (itemId) => {
		let newArray = [...addItems];
		if (newArray.includes(itemId)) {
			newArray = newArray.filter(el => el !== itemId);
		} else {
			newArray = [...newArray, itemId];
		}
		setAddItems(newArray);
	};


	const addButtonCSS = 'add-role-button ' + (addItems.length > 0 ? '' : 'add-role-button-grey');
	const dropDownOptions = Object.keys(displayedRows).reduce((total, itemId) => {
		const itemData = displayedRows[itemId];
		const selectItem = addItems.includes(itemId);
		const tickColour = selectItem ? 'green' : 'transparent';
		return {
			...total,
			[itemId]: (
				<div style={{ height: '40px' }}>
					<TripleFill
						left={(
							<div>
								<div className="user-circle" style={{ position: 'relative' }}>
									<FontAwesomeIcon icon={faCheckCircle} style={{ position: 'absolute', color: tickColour, fontSize: '38px', top: '-1px', left: '-1px' }} />
									<img className="user-image" src={itemData.image} alt="xd" />
								</div>
							</div>
						)}
						center={<p className="user-name">{itemData.name}</p>}
						right={null}
					/>
				</div>)
		};
	}, {});
	return (
		<div>
			<GenericDropdown
				options={dropDownOptions}
				style={{ dropdown: 'dropdown-wrapper' }}
				submit={userClicked}
				onBlur={() => { console.log('blurred'); }}
				onSearchChange={onSearchChange}
				searchString={searchString}
				autoFocus={!isMobile}
				placeholder="Assign a user..."
				canSearch={true}
			/>

			<button className={addButtonCSS} type="button" onClick={() => { if (addItems.length > 0) { props.submit(addItems); } }}>Add Users!</button>
		</div>
	);
};

export default AddGenericDropDown;
