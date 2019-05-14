import React, { PureComponent } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { isMobile } from 'react-device-detect';
import { TripleFill, GenericDropdown } from '@execview/reusable';
import './CircleUser.css';

export default class AddUserDropDown extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      displayedRows: this.props.nonAssignedUsers,
      addUsers: []
    };
  }

  onSearchChange = (value) => {
    const newRows = this.props.nonAssignedUsers.filter(user => this.props.getUserProfile(user).name.toLowerCase().includes(value));
    this.setState({ searchString: value, displayedRows: newRows });
  }

  userClicked = (user) => {
    let newArray = [...this.state.addUsers];
    if (newArray.includes(user)) {
      newArray = newArray.filter(el => el !== user);
    } else {
      newArray = [...newArray, user];
    }
    this.setState({ addUsers: newArray });
  }

  render() {
    const addButtonCSS = 'add-role-button ' + (this.state.addUsers.length > 0 ? '' : 'add-role-button-grey');
    const dropDownOptions = this.state.displayedRows.reduce((total, user) => {
      const selectUser = this.state.addUsers.includes(user);
      const tickColour = selectUser ? 'green' : 'transparent';
      return { ...total,
        [user]: (
          <div style={{ height: '40px' }}>
            <TripleFill
              left={(
                <div>
                  <div className="user-circle" style={{ position: 'relative' }}>
                    <FontAwesomeIcon icon={faCheckCircle} style={{ position: 'absolute', color: tickColour, fontSize: '38px', top: '-1px', left: '-1px' }} />
                    <img className="user-image" src={this.props.getUserProfile(user).image} alt="xd" />
                  </div>
                </div>
              )}
              center={<p className="user-name">{this.props.getUserProfile(user).name}</p>}
              right={null}
            />
          </div>) };
    }, {});
    return (
      <div>
        <GenericDropdown
          options={dropDownOptions}
          style={{ dropdown: 'dropdown-wrapper' }}
          submit={this.userClicked}
          onBlur={() => { console.log('blurred'); }}
          onSearchChange={this.onSearchChange}
          searchString={this.state.searchString}
          autoFocus={!isMobile}
          placeholder="Assign a user..."
          canSearch={true}
        />

        <button className={addButtonCSS} type="button" onClick={() => { if (this.state.addUsers.length > 0) { this.props.submitUsers(this.state.addUsers); } }}>Add Users!</button>
      </div>
    );
  }
}
