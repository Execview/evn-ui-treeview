import React, { PureComponent } from 'react';
import CircleUser from './CircleUser'
import GenericDropdown from '../dropdownCell/GenericDropdown'
import './CircleUser.css';

export default class UserMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      	searchString: '',
     	displayedRows: this.props.data
    };
  }

	submitUser = (user) => {
		console.log(user)
		//console.log(this.props.userProfiles[user].name)
		//this.props.nextScreen()
	}
  	render() {
		let dropDownOptions = this.state.displayedRows.reduce((total,user) => {
			return {...total, [user]: (
				<div>
					<div style={{display:'inline-block'}}><CircleUser {...this.props} userid={user} /></div>
					<div style={{display:'inline-block', color:'white'}}>{this.props.userProfiles[user].name}</div>
					<div style={{display:'inline-block', width:'20px', height:'20px', marginLeft:'20px', color:'white',backgroundColor:'red', borderRadius:'50%'}}>X</div>		
				</div>)}			
			},{})
		dropDownOptions['addUser'] = (<div onClick={this.props.nextScreen}>
					<div style={{display:'inline-block'}}><CircleUser userProfiles={{add: {image: 'https://www.unizambeze.ac.mz/wp-content/uploads/2016/07/plus-4-xxl.png'}}} userid={'add'} /></div>
					<div style={{display:'inline-block', color:'white'}}>Add new user</div>					
				</div>
		)
    	return (
			<div className="user-menu">
				Assigned Users!
				<GenericDropdown
					options={dropDownOptions}
					onBlur={this.onBlur} 
					submit={this.submitUser} 
					searchString={this.state.searchString}/>
				ADD USER BUTTON			
		</div>
    	);
  	}
}
