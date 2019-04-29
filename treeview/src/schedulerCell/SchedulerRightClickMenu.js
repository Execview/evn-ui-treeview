import React, { Component } from 'react';
import { GenericDropdown } from '@execview/table'

class SchedulerRightClickMenu extends Component {
	onSubmit = () => {
		this.props.contextMenu.closeMenu();
	}

  render() {
    return (
      <foreignObject x={this.props.contextMenu.position[0]} y={this.props.contextMenu.position[1]} width="200" height="100%" style={{MozUserSelect:"none", WebkitUserSelect:"none",msUserSelect:"none"}}>
			<div >
				<GenericDropdown
					onBlur={this.props.contextMenu.closeMenu}
					submit={option => this.onSubmit(option)}
					options={this.props.contextMenu.options}
				/>		
				<img alt="Whats this?" style={{width:'100%'}} src="https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg"/>
			</div>
		</foreignObject>);
  }
}

export default SchedulerRightClickMenu;
