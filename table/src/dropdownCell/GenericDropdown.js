import React, { Component } from 'react';
import './DropdownCell.css';

export default class DropdownCellEditor extends Component {
  render() {
    return (
      <div className="dropdown" style={this.props.style} onBlur={this.props.onBlur}>
        {this.props.canSearch && <input className="dropdown-input" autoFocus type="text" value={this.props.searchString} onChange={e => this.props.onSearchChange(e.target.value)} placeholder={this.props.placeholder || "Search.."} />}
        <ul className="dropdown-menu">
          {Object.keys(this.props.options).map((v,index) => <li className="dropdown-item" autoFocus key={index} onMouseDown={() => this.props.submit(v)}>{this.props.options[v]}</li>)}
        </ul>
      </div>);
  }
}
