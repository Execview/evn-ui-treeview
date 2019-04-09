import React, { PureComponent } from 'react';
import './CircleUser.css';
import GenericDropdown from '../dropdownCell/GenericDropdown';
import { isMobile } from 'react-device-detect';

export default class AddRole extends PureComponent {
  constructor(props) {
    super(props);
    this.roles = ['Project Manager', 'Peasant', 'Wizard', 'Jester', 'Drunkard', 'Damsel', 'Dovahkiin FUS-RO-DAH'];
    this.state = {
      searchString: '',
      displayedRows: this.roles
    };
  }

  onSearchChange = (value) => {
    const newRows = this.roles.filter(v => v.toLowerCase().includes(value.toLowerCase()));
    this.setState({ searchString: value, displayedRows: newRows });
  }

  submitRole = (role) => {
    this.props.submitRole(this.props.addRoleTo, role);
  }

  render() {
    return (
      <div>
        <GenericDropdown
          options={this.state.displayedRows.reduce((total, role) => { return { ...total, [role]: role }; }, {})}
          submit={this.submitRole}
          searchString={this.state.searchString}
          onSearchChange={this.onSearchChange}
          canSearch={true}
          autoFocus={!isMobile}
          placeholder="Assign a role..."
          style={{ color: 'white' }}
        />
      </div>
    );
  }
}
