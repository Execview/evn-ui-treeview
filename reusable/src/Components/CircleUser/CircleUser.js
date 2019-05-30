import React, { PureComponent } from 'react';
import './CircleUser.css';

export default class CircleUser extends PureComponent {
  render() {
    return (
      <div className={"user-circle " + this.props.className}>
        <img className="user-image" src={this.props.url} alt="xd" />
      </div>
    );
  }
}