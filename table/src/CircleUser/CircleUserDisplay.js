import React, { Component } from 'react';
import './CircleUser.css';
import CircleUser from './CircleUser';
import AssignUsers from './AssignUsers'

export default class CircleUserDisplay extends Component {
  state = { open: false };

  


  render() {
    let circlesLimit = this.props.data.length;
    let addAmount = null;
    if (this.props.style.width < (this.props.data.length + 1) * 20) {
      circlesLimit = parseInt((this.props.style.width - 40) / 20, 10);
      addAmount = <div className="add-container" style={{ left: ((circlesLimit + 1) * 20) + 1 }}>{'+' + (this.props.data.length - circlesLimit)}</div>;
    }
    return (
      <div className="user-cell">
        <div className="users-container" onClick={() => { this.setState({ open: !this.state.open }); }}>
          {this.props.data && this.props.data.slice(0, circlesLimit).map((user, index) => {
            return (
              <div className="user-profile" key={'circle' + (index + 1)} style={{ zIndex: this.props.data.length - index, left: 20 * index }}>
                <CircleUser url={this.props.userProfiles[user].image} />
              </div>
            );
          })}
          {addAmount}
        </div>
        {this.state.open && 
			<AssignUsers 
				assignedUsers={this.props.data} 
				userProfiles={this.props.userProfiles} 
				style={this.props.style}
				closeMenu={() => this.setState({ open: false })}
				onValidateSave={this.props.onValidateSave}/>}
      </div>
    );
  }
}
