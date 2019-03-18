import React, { PureComponent } from 'react';
import CircleUser from './CircleUser';
import TripleFill from './TripleFill';
import GenericDropdown from '../dropdownCell/GenericDropdown';
import './CircleUser.css';

export default class UserMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      userOpen: null
    };
  }

  submitUser = (user) => {
    console.log(user);
  }

  toggleDetails(userId) {
    console.log(userId);
    this.state.userOpen === userId ? this.setState({ userOpen: null }) : this.setState({ userOpen: userId });
  }

  render() {
    const dropDownOptions = this.props.assignedUsers.reduce((total, assigneduser) => {
      const elHeight = assigneduser.user === this.state.userOpen ? '100px' : '40px';
      return { ...total,
        [assigneduser.user]: (
          <div className="user-row" style={{ height: elHeight, overflow: 'hidden' }} onClick={() => this.toggleDetails(assigneduser.user)}>
            <TripleFill
              style={{ height: '40px' }}
              left={<CircleUser url={this.props.getUserProfile(assigneduser.user).image} />}
              center={<p className="user-name">{this.props.getUserProfile(assigneduser.user).name}</p>}
              right={<div className="close-container" onClick={() => this.props.unassignUser(assigneduser.user)}><i className="fas fa-trash close-icon" /></div>}
            />
            <div>

            </div>
          </div>)
      };
    }, {});
    const welcomeMessage = Object.keys(dropDownOptions).length
      ? <p className="current-users-message">Assigned users:</p>
      : <p className="no-users-message">There are no users currently assigned to this project!</p>;
    return (
      <div>
        <div className="check-container"><i className="fas fa-users" style={{ color: 'white' }} /></div>
        {welcomeMessage}
        <GenericDropdown
          style={{ dropdownItem: 'hover-class', dropdown: 'dropdown-wrapper' }}
          options={dropDownOptions}
          onBlur={this.onBlur}
          submit={this.submitUser}
          searchString={this.state.searchString}
        />
        <div className="plus-container" onClick={this.props.nextScreen}>
          <TripleFill
            left={<CircleUser url="https://www.unizambeze.ac.mz/wp-content/uploads/2016/07/plus-4-xxl.png" />}
            center={<p className="user-name">Assign new user</p>}
          />
        </div>
      </div>
    );
  }
}
