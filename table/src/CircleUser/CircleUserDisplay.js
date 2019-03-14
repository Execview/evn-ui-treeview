import React, { Component } from 'react';
import './CircleUser.css';
import CircleUser from './CircleUser';
import UserMenu from './UserMenu';

export default class CircleUserDisplay extends Component {
  state = { open: false };

  unassignUser = (userid) => {
    console.log(userid);
    this.props.onValidateSave(this.props.data.filter(el => el !== userid));
  }

  
  render() {
    let circlesLimit = this.props.data.length;
    if (this.props.style.width < (this.props.data.length + 1) * 20) {
      circlesLimit = parseInt((this.props.style.width - 50) / 20, 10);
    }

    let addAmount = this.props.data.length - circlesLimit;
    if (addAmount < 0) {
      addAmount = 0;
    }

    const addAmountText = addAmount === 0 ? '' : '+' + addAmount.toString();
    
    return (
      <div className="user-cell" width={this.props.style.width}>
        <div className="users-container" onClick={() => { this.setState({ open: !this.state.open }); }}>
          {this.props.data && this.props.data.slice(0, circlesLimit).map((user, index) => {
            return (
              <div className="user-profile" key={'circle' + index} style={{ zIndex: this.props.data.length - index, left: 20 * index }}>
                <CircleUser {...this.props} userid={user} />              
              </div>
            );
          })}
          <div className="add-container">{addAmountText}</div>
        </div>
        {this.state.open && <UserMenu {...this.props} closeMenu={() => this.setState({ open: false })} unassignUser={this.unassignUser} />}
      </div>
    );
  }
}
