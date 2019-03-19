import React, { Component } from 'react';
import GenericDropdown from './GenericDropdown'
import './DropdownCell.css';

export default class DropdownCellEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      	searchString: '',
      	displayedRows: this.props.dropdownList || []
    };
  }

  	onSearchChange = (value)=>{
    	const newRows = this.props.dropdownList.filter(v => v.toLowerCase().includes(value));
    	this.setState({ searchString: value, displayedRows: newRows });
  	}

  	onBlur = () => {this.props.onValidateSave(this.props.data)}

  	render() {
		const options = this.state.displayedRows.reduce((total,option)=>{return {...total,[option]:option}},{})
		return (
			<div className='dropdown-celleditor'>
			<GenericDropdown 
				{...this.props} 
				onBlur={this.onBlur} 
				submit={(key)=>this.props.onValidateSave(options[key])}
				canSearch={true}
				onSearchChange={this.onSearchChange} 
				searchString={this.state.searchString} 
				options={options}/>
			</div>
		);
  	}
}
