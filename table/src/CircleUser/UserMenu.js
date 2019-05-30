import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp, faAngleDown, faTrash, faUsers, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { TripleFill, GenericDropdown, CircleUser } from '@execview/reusable';
import './CircleUser.css';
import UserDetails from './UserDetails';

export default class UserMenu extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      userOpen: null
    };
  }

  toggleDetails(userId) {
    this.state.userOpen === userId ? this.setState({ userOpen: null }) : this.setState({ userOpen: userId });
  }

  render() {
    const assignedUsers = this.props.assignedUsers || [];
    const dropDownOptions = assignedUsers.reduce((total, assigneduser) => {
      const elHeight = assigneduser.user === this.state.userOpen ? '300px' : '40px';
      const arrowType = assigneduser.user === this.state.userOpen ? <FontAwesomeIcon icon={faAngleUp} /> : <FontAwesomeIcon icon={faAngleDown} />;
      return { ...total,
        [assigneduser.user]: (
          <div className="user-row" style={{ maxHeight: elHeight, overflow: 'hidden' }} onClick={() => this.toggleDetails(assigneduser.user)}>
            <TripleFill
              style={{ height: '40px', cursor: 'pointer' }}
              left={<CircleUser url={this.props.getUserProfile(assigneduser.user).image} />}
              center={<p className="user-name">{this.props.getUserProfile(assigneduser.user).name}</p>}
              right={(
                <div style={{ lineHeight: '40px' }}>
                  <span className="arrow-more-info">
                    {arrowType}
                  </span>
                  <span className="close-container" onClick={() => this.props.unassignUser(assigneduser.user)}><FontAwesomeIcon icon={faTrash} className="close-icon" /></span>
                </div>
              )}
            />
            {assigneduser.user === this.state.userOpen && (
              <div className="user-toggle-details">
                <UserDetails user={assigneduser} editExistingRole={this.props.editExistingRole} />
              </div>
            )}
          </div>)
      };
    }, {});
    const welcomeMessage = Object.keys(dropDownOptions).length
      ? <p className="current-users-message">Assigned users:</p>
      : <p className="no-users-message">There are no users currently assigned to this project!</p>;
    return (
      <div>
        <div className="check-container"><FontAwesomeIcon icon={faUsers} style={{ color: 'white' }} /></div>
        {welcomeMessage}
        <GenericDropdown
          style={{ dropdownItem: 'hover-class', dropdown: 'dropdown-wrapper' }}
          options={dropDownOptions}
          onBlur={this.onBlur}
          searchString={this.state.searchString}
        />
        <div className="plus-container" onClick={this.props.nextScreen}>
          <TripleFill
            left={<FontAwesomeIcon className="plus-container-icon" icon={faPlusCircle} />}
            center={<p className="user-name">Assign new user</p>}
          />
        </div>
      </div>
    );
  }
}
