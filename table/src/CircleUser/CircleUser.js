import React, { Component } from 'react';
import './CircleUser.css';

export default class CircleUser extends Component {
  render() {
    return (
      <div className="user-circle">
        <img className="user-image" src={this.props.userProfiles[this.props.userid].image} alt="xd" />
      </div>
    );
  }
}
