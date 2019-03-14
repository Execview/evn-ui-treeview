import React, { PureComponent } from 'react';
import './CircleUser.css';
import GenericDropdown from '../dropdownCell/GenericDropdown'

export default class AddRole extends PureComponent {
	constructor(props) {
		super(props);
		this.roles = ["Project Manager","Peasant","rOcKStaR dEVeLopEr"]
		this.state = {
			searchString: '',
			displayedRows: this.roles
		};
 	}

	onSearchChange = (value)=>{
		const newRows = this.roles.filter(v => v.toLowerCase().includes(value));
		this.setState({ searchString: value, displayedRows: newRows });
	}

	submitRole = (role) => {
		console.log(role)
	}
  	render() {
    	return (
		<div>
			<GenericDropdown 
				options={this.state.displayedRows.reduce((total,role)=>{return {...total,[role]:role}},{})}
				submit={this.submitRole} 
				searchString={this.state.searchString}
				canSearch={true}
				placeholder={'Assign a role...'}
				style={{color: 'white'}}/>
		</div>
    	);
  	}
}
