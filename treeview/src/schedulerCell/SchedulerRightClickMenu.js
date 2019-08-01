import React, { Component } from 'react';
import { GenericDropdown } from '@execview/reusable'
import classes from './SchedulerRightClickMenu.module.css' 

class SchedulerRightClickMenu extends Component {
	onSubmit = () => {
		this.props.closeMenu();
	}

  render() {
    return (
      <foreignObject x={this.props.position[0]} y={this.props.position[1]} width="200" height="100%" style={{MozUserSelect:"none", WebkitUserSelect:"none",msUserSelect:"none"}}>
			<div className={classes["menu"]}>
				<GenericDropdown
					onBlur={this.props.closeMenu}
					submit={option => this.onSubmit(option)}
					options={this.props.options}
				/>		
				{/* <img alt="Whats this?" style={{width:'100%'}} src="https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg"/> */}
			</div>
		</foreignObject>);
  }
}

export default SchedulerRightClickMenu;
