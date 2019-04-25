import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import './UserHeader.css';

export default class UserHeaderDisplay extends Component {
  render() {
    return (
      <div className="user-header-container" title="Assigned Users">
        <FontAwesomeIcon icon={faUserCircle} className="user-header" />
      </div>
    );
  }
}
