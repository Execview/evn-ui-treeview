import React, { Component } from 'react';
import './UserHeader.css';

export default class UserHeaderDisplay extends Component {
  render() {
    return (
      <div className="user-header-container" title="Assigned Users">
        <i className="fas fa-user-circle user-header" />
      </div>
    );
  }
}
