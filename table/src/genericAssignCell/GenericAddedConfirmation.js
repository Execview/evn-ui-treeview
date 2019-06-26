import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { TripleFill, CircleUser } from '@execview/reusable';
import './GenericAssignDisplay.css';

const UserAddedConfirmation = (props) => {
	return (
		<div className="confirmation-container">
		<div className="check-container">
			<FontAwesomeIcon icon={faCheck} />
		</div>
		<div className="confirmation-content">
			<p className="text-focus-in check-success">Success!</p>
			<p className="text-focus-in success-message">Users have been added successfully!</p>
			<ul className="added-list">
			{props.selectedItems.map(id => (
				<li key={id} className="user-item">
				<TripleFill
					left={<CircleUser url={props.allItems[id].image} />}
					center={<p className="user-name">{props.allItems[id].name}</p>}
					right={<button className="add-role-button" type="button" onClick={() => props.addExtraTo(id)}>Set role</button>}
				/>
				</li>
			))}
			</ul>
		</div>
		</div>
	);
};

export default UserAddedConfirmation;
