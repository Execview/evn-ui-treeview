import React, { PureComponent } from 'react';
import './CircleUser.css';
import UserMenu from './UserMenu';
import AddUserDropDown from './AddUserDropDown'
import UserAddedConfirmation from './UserAddedConfirmation'
import AddRole from './AddRole'

export default class AssignUsers extends PureComponent {
	constructor(){
		super()
		this.state = {visiblePanel: 'UserMenu'}
	}

	unassignUser = (userid) => {
		console.log(userid);
		this.props.onValidateSave(this.props.assignedUsers.filter(el => el !== userid));
	}

	addUser = (userid) => {
		console.log(userid);
		this.props.onValidateSave([...this.props.assignedUsers,userid]);
	}


	onProgress = () => {
		let newPage = ''
		switch(this.state.visiblePanel){
			case 'UserMenu':
				newPage = 'AddUserDropDown'
				break;
			case 'AddUserDropDown':
				newPage = 'UserAddedConfirmation'
				break;
			case 'UserAddedConfirmation':
				newPage = 'AddRole'
				break;
			case 'AddRole':
				newPage = 'UserAddedConfirmation'
				break;
		}
		this.setState({visiblePanel: newPage})
	}

  	render() {
    	return (
      		<div className="user-menu" onBlur={this.props.closeMenu}>
      			{this.state.visiblePanel==="UserMenu" && 
				  	<UserMenu 
					  	assignedUsers={this.props.assignedUsers} 
						userProfiles={this.props.userProfiles} 
						unassignUser={this.unassignUser}
						nextScreen={this.onProgress}
						/>}
				{this.state.visiblePanel==="AddUserDropDown" && 
					<AddUserDropDown 
						nonAssignedUsers={Object.keys(this.props.userProfiles).filter(key=>!this.props.assignedUsers.includes(key))} 
						userProfiles={this.props.userProfiles} 
						nextScreen={this.onProgress}
						addUser={this.addUser}
						/>}
				{this.state.visiblePanel==="UserAddedConfirmation" && 
					<UserAddedConfirmation 
						nextScreen={this.onProgress}
						/>}
				{this.state.visiblePanel==="AddRole" && 
					<AddRole
						nextScreen={this.onProgress}/>}
     		</div>
    	);
 	}
}
