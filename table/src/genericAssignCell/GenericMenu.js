import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faTrash, faUsers, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TripleFill, GenericDropdown, CircleUser } from '@execview/reusable';
import './GenericAssignDisplay.css';
import GenericDetails from './GenericDetails';

const GenericMenu = (props) => {
	const [detailsOpen, setDetailsOpen] = useState(null);

	const toggleDetails = (itemId) => {
		if (detailsOpen === itemId) {
			setDetailsOpen(null);
		} else {
			setDetailsOpen(itemId);
		}
	};

	const items = props.items || {};
	const dropDownOptions = items.reduce((total, itemId) => {
		const itemData = props.allItems[itemId];
		const elHeight = itemId === detailsOpen ? '300px' : '40px';
		const arrowType = itemId === detailsOpen ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />;
		return {
			...total,
			[itemId]: (
				<div className="user-row" style={{ maxHeight: elHeight, overflow: 'hidden' }} onClick={() => toggleDetails(itemId)}>
					<TripleFill
						style={{ height: '40px', cursor: 'pointer' }}
						left={<CircleUser url={itemData.image} />}
						center={<p className="user-name">{itemData.name}</p>}
						right={(
							<div style={{ lineHeight: '40px' }}>
								<span className="arrow-more-info">
									{arrowType}
								</span> 
								<span className="close-container" onClick={() => props.unassignGeneric(itemId)}><FontAwesomeIcon icon={faTrash} className="close-icon" /></span>
							</div>
						)}
					/>
					{itemId === detailsOpen && (
						<div className="user-toggle-details">
							<GenericDetails user={itemData} editExistingRole={props.addExtraTo} />
						</div>
					)}
				</div>)
		};
	}, {});
	const welcomeMessage = Object.keys(dropDownOptions).length
		? <p className="current-users-message">Assigned users:</p>
		: <p className="no-users-message">There are no users currently assigned to this project!</p>;
	return (
		<div>
			<div className="check-container"><FontAwesomeIcon icon={faUsers} style={{ color: 'white' }} /></div>
			{welcomeMessage}
			<GenericDropdown
				style={{ dropdownItem: 'hover-class', dropdown: 'dropdown-wrapper' }}
				options={dropDownOptions}
			/>
			<div className="plus-container" onClick={props.nextScreen}>
				<TripleFill
					left={<FontAwesomeIcon className="plus-container-icon" icon={faPlusCircle} />}
					center={<p className="user-name">Assign new user</p>}
				/>
			</div>
		</div>
	);
};

export default GenericMenu;
