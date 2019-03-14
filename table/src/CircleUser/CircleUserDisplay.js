import React, { Component } from 'react';
import './CircleUser.css';
import CircleUser from './CircleUser';
import AssignUsers from './AssignUsers'

export default class CircleUserDisplay extends Component {
  state = { open: false };

  unassignUser = (userid) => {
    console.log(userid);
    this.props.onValidateSave(this.props.data.filter(el => el !== userid));
  }


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
                <CircleUser {...this.props} userid={user} />
              </div>
            );
          })}
          {addAmount}
        </div>
        {this.state.open && <AssignUsers {...this.props} closeMenu={() => this.setState({ open: false })} unassignUser={this.unassignUser} />}
      </div>
    );
  }
}
