import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { TripleFill, CircleUser } from '@execview/reusable';
import './CircleUser.css';

 const UserAddedConfirmation = (props) => {
	 const getAddRoleButton = (id) => {
		let setRoleButton = null
		switch(props.type){
			case 'activity': {
				setRoleButton = <button className="add-role-button" type="button" onClick={() => props.addRoleTo(id)}>Set role</button>
				break;
			}
			case 'role':{
				setRoleButton = null
				break;
			}
			default: {break; }
		} 
		return setRoleButton
	 }
	
	return (
		<div className="confirmation-container">
		<div className="check-container">
			<FontAwesomeIcon icon={faCheck} />
		</div>
		<div className="confirmation-content">
			<p className="text-focus-in check-success">Success!</p>
			<p className="text-focus-in success-message">Users have been added successfully!</p>
			<ul className="added-list">
			{props.assignedUsers.map(id => (
				<li key={id} className="user-item">
				<TripleFill
					left={<CircleUser url={props.getUserProfile(id).image} />}
					center={<p className="user-name">{props.getUserProfile(id).name}</p>}
					right={getAddRoleButton(id)}
				/>
				</li>
			))}
			</ul>
		</div>
		</div>
	);
}

export default UserAddedConfirmation
