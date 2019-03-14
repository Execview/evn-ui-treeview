import React, { PureComponent } from 'react';
import CircleUser from './CircleUser'
import './CircleUser.css';

export default class UserMenu extends PureComponent {
  render() {
    return (
      <div className="user-menu" onBlur={this.props.closeMenu}>
      <input focus/>
      <table>
        {this.props.data && this.props.data.map(user => {
            return (
              <tr>
                <td><CircleUser {...this.props} userid={user} /></td>
                <td>{this.props.userProfiles[user].name}</td>
              </tr>            
            );
          })}
      </table>
      </div>
    );
  }
}
