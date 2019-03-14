import React, { PureComponent } from 'react';
import CircleUser from './CircleUser'
import GenericDropdown from '../dropdownCell/GenericDropdown'
import './CircleUser.css';

export default class AddUserDropDown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      	searchString: '',
      	displayedRows: this.props.nonAssignedUsers
    };
  	}

	onSearchChange = (value)=>{
		const newRows = this.props.nonAssignedUsers.filter(user => this.props.userProfiles[user].name.toLowerCase().includes(value));
		this.setState({ searchString: value, displayedRows: newRows });
	}

	submitUser = (user) => {
		console.log(user)
		console.log(this.props.userProfiles[user].name)
		this.props.addUser(user)
		this.props.nextScreen()
	}
  	render() {
		const dropDownOptions = this.state.displayedRows.reduce((total,user) => {
			return {...total, [user]: (
				<div>
					<div style={{display:'inline-block'}}><CircleUser url={this.props.userProfiles[user].image} /></div>
					<div style={{display:'inline-block', color:'white'}}>{this.props.userProfiles[user].name}</div>					
				</div>)}			
			},{})
    	return (
			<div className="user-menu">
				ADD A USER
				<GenericDropdown
					options={dropDownOptions}
					onBlur={this.onBlur} 
					submit={this.submitUser} 
					onSearchChange={this.onSearchChange} 
					searchString={this.state.searchString}
					placeholder={'Assign a user...'}
					canSearch={true}
				/>
		</div>
    	);
  	}
}
