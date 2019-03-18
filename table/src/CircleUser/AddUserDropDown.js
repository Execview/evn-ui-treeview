import React, { PureComponent } from 'react';
import CircleUser from './CircleUser'
import GenericDropdown from '../dropdownCell/GenericDropdown'
import './CircleUser.css';

export default class AddUserDropDown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      	searchString: '',
      	displayedRows: this.props.nonAssignedUsers,
		addUsers: []
    };
  	}

	onSearchChange = (value)=>{
		const newRows = this.props.nonAssignedUsers.filter(user => this.props.userProfiles[user].name.toLowerCase().includes(value));
		this.setState({ searchString: value, displayedRows: newRows });
	}

	userClicked = (user) => {
		let newArray = [...this.state.addUsers]
		if(newArray.includes(user)){newArray=newArray.filter(el=>el!==user)}
		else {newArray=[...newArray,user]}
		this.setState({addUsers: newArray})
	}

  	render() {
		
		const dropDownOptions = this.state.displayedRows.reduce((total,user) => {
			const selectUser = this.state.addUsers.includes(user)
			const tickColour =  selectUser ? 'green':'transparent'
			return {...total, [user]: (
				<div>
					<i className="fas fa-check-circle" style={{position:'absolute', marginLeft:'4px', marginTop:'4px', color:tickColour, 
					fontSize:'2em'}}></i>
					<div style={{display:'inline-block'}}><CircleUser url={this.props.userProfiles[user].image} /></div>
					<div style={{display:'inline-block', color:'white'}}>{this.props.userProfiles[user].name}</div>						
				</div>)}			
			},{})
    	return (
			<div className="user-menu">
				<GenericDropdown
					options={dropDownOptions} 
					submit={this.userClicked} 
					onSearchChange={this.onSearchChange} 
					searchString={this.state.searchString}
					placeholder={'Assign a user...'}
					canSearch={true}
				/>
				<button onClick={()=>{this.props.submitUsers(this.state.addUsers)}}>Add Users!</button>
		</div>
    	);
  	}
}
