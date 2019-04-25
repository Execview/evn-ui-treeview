import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserEdit } from '@fortawesome/free-solid-svg-icons';
import TripleFill from './TripleFill';
import './CircleUser.css';

export default class UserDetails extends Component {
  render() {
    const user = this.props.user || {};
    const editRole = this.props.editExistingRole || (() => {});
    return (
      <div>
        <TripleFill
          style={{ height: '20px', cursor: 'pointer' }}
          center={<p className="user-toggle-detail" style={{ display: 'inline-block' }}><b>Role:</b> {user.role}</p>}
          right={<FontAwesomeIcon icon={faUserEdit} style={{ cursor: 'pointer', marginLeft: '10px', display: 'inline-block' }} onClick={() => editRole(user.user)} />}
        />

        {user.department && (
          <TripleFill
            style={{ height: '20px', cursor: 'pointer' }}
            center={<p className="user-toggle-detail"><b>Department:</b> {user.department}</p>}
          />
        )
		}
      </div>);
  }
}
