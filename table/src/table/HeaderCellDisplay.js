import React, { Component } from 'react';

export default class HeaderCellDisplay extends Component {
  render() {
    return (
      <div className="header-cell" onMouseDown={this.props.data.sortData}>
        {this.props.data.spans}
        <div className="thead-container toggle-wrap" style={{ width: this.props.style.width - 30 }}>{this.props.data.title}</div>
      </div>
    );
  }
}
