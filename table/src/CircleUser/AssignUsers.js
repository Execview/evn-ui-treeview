import React, { PureComponent } from 'react';
import './CircleUser.css';
import UserMenu from './UserMenu';
import AddUserDropDown from './AddUserDropDown'
import UserAddedConfirmation from './UserAddedConfirmation'
import AddRole from './AddRole'

export default class AssignUsers extends PureComponent {
	constructor(){
		super()
		this.state = {
			visiblePanel: 'UserMenu',
			assignUsers: [],
			assignRoleTo: ''
			}
	}

	componentDidMount(){
		document.addEventListener('mousedown', this.handleClick)
	}
	componentWillUnmount(){
		document.removeEventListener('mousedown', this.handleClick)
	}

	handleClick = (e)=>{
		if(!this.node.contains(e.target)){
			this.props.closeMenu()
		}
	}

	unassignUser = (userid) => {
		console.log(userid);
		this.props.onValidateSave(this.props.assignedUsers.filter(el => el !== userid));
	}

	assignUsers = (users) => {
		console.log(users)
		this.props.onValidateSave([...this.props.assignedUsers,...users])
		this.setState({assignUsers: users})
	}

	submitRole = (user,role) => {
		console.log(role);
		console.log(user)
		this.setState({assignUsers: this.state.assignUsers.filter(el=>el!==user)});
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
      		<div className="user-menu" ref={node=> this.node=node}>
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
						submitUsers={this.assignUsers} 
						userProfiles={this.props.userProfiles} 
						nextScreen={this.onProgress}
						/>}
				{this.state.visiblePanel==="UserAddedConfirmation" && 
					<UserAddedConfirmation 
						nextScreen={this.onProgress}
						assignedUsers={this.state.assignUsers}
						userProfiles={this.props.userProfiles}
						addRoleTo={(user)=>this.setState({addRoleTo: user})}
						/>}
				{this.state.visiblePanel==="AddRole" && 
					<AddRole
						nextScreen={this.onProgress}
						submitRole={this.submitRole}
						addRoleTo={this.state.addRoleTo}
						/>}
     		</div>
    	);
 	}
}
