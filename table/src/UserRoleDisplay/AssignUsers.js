import React, { PureComponent } from 'react';
import onClickOutside from 'react-onclickoutside';
import './CircleUser.css';
import UserMenu from './UserMenu';
import AddUserDropDown from './AddUserDropDown';
import UserAddedConfirmation from './UserAddedConfirmation';
import AddRole from './AddRole';

class AssignUsers extends PureComponent {
  constructor() {
    super();
    this.state = {
      visiblePanel: 'UserMenu',
      assignUsers: [],
      assignRoleTo: ''
    };
  }

  handleClickOutside = () => {
    this.props.closeMenu();
  };

  unassignUser = (userid) => {
    this.props.onValidateSave(this.assignedUsers.filter(el => el.user !== userid));
  }

  assignUsers = (users) => {
    const newUsers = users.map(id => ({ user: id }));
    this.props.onValidateSave([...this.assignedUsers, ...newUsers]);
    this.setState({ assignUsers: users });
    this.nextScreen();
  }

  submitRole = (user, role) => {
    const currentUser = this.assignedUsers.filter(assigned => assigned.user === user)[0];
    const newUsers = [...this.assignedUsers.filter(assigned => assigned.user !== user), { ...currentUser, user, role }];
    this.props.onValidateSave(newUsers);
    this.setState({ assignUsers: this.state.assignUsers.filter(el => el !== user) });
    this.nextScreen();
  }

  editExistingRole = (user) => {
    this.setState({ addRoleTo: user, visiblePanel: 'AddRole' });
  }

  nextScreen = () => {
    let newPage = '';
    switch (this.state.visiblePanel) {
      case 'UserMenu':
        newPage = 'AddUserDropDown';
        break;
      case 'AddUserDropDown':
        newPage = 'UserAddedConfirmation';
        break;
      case 'UserAddedConfirmation':
        newPage = 'AddRole';
        break;
      case 'AddRole':
        newPage = 'UserAddedConfirmation';
        break;
      default:
        break;
    }
    this.setState({ visiblePanel: newPage });
  }

  render() {
    this.assignedUsers = this.props.assignedUsers || [];
    return (
      <div className="user-menu" ref={node => this.node = node}>
        <div className="absolute-caret" />
        {this.state.visiblePanel === 'UserMenu'
      && (
      <UserMenu
        assignedUsers={this.assignedUsers}
        getUserProfile={this.props.getUserProfile}
        editExistingRole={this.editExistingRole}
        unassignUser={this.unassignUser}
        nextScreen={this.nextScreen}
      />
      )}
        {this.state.visiblePanel === 'AddUserDropDown'
      && (
      <AddUserDropDown
        nonAssignedUsers={this.props.getAllUserProfileKeys().filter(key => !(this.assignedUsers.map(el => el.user)).includes(key))}
        submitUsers={this.assignUsers}
        getUserProfile={this.props.getUserProfile}
      />
      )}
        {this.state.visiblePanel === 'UserAddedConfirmation'
      && (
      <UserAddedConfirmation
        assignedUsers={this.state.assignUsers}
        getUserProfile={this.props.getUserProfile}
        addRoleTo={(user) => { this.setState({ addRoleTo: user }); this.nextScreen(); }}
      />
      )}
        {this.state.visiblePanel === 'AddRole'
      && (
      <AddRole
        submitRole={this.submitRole}
        addRoleTo={this.state.addRoleTo}
      />
      )}
      </div>
    );
  }
}

export default onClickOutside(AssignUsers);
