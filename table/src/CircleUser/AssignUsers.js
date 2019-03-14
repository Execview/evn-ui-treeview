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

	onProgress = () => {
		const pages = ['UserMenu','AddUserDropDown','UserAddedConfirmation']
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
				newPage = 'UserMenu'
				break;
		}
		this.setState({visiblePanel: newPage})
	}


  	render() {
		console.log(this.state.visiblePanel)
    	return (
      		<div className="user-menu" onBlur={this.props.closeMenu}>
      			{this.state.visiblePanel==="UserMenu" && <UserMenu {...this.props} nextScreen={this.onProgress}/>}
				{this.state.visiblePanel==="AddUserDropDown" && <AddUserDropDown {...this.props} nextScreen={this.onProgress} data={Object.keys(this.props.userProfiles).filter(key=>!this.props.data.includes(key))}/>}
				{this.state.visiblePanel==="UserAddedConfirmation" && <UserAddedConfirmation {...this.props} nextScreen={this.onProgress} />}
				{this.state.visiblePanel==="AddRole" && <AddRole {...this.props} nextScreen={this.onProgress}/>}
     		</div>
    	);
 	}
}
