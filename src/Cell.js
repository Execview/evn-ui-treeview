import React, { Component } from 'react';
import CellEditor from './CellEditor';
import './App.css';

export default class Cell extends Component {
  hideLabel= () => {
    this.props.setActive(this.props.row, this.props.col, this.props.rule, this.props.text);
  }

  render() {
    let cell;
    if (this.props.isActive) {
      cell = (<td className="table-label" onClick={this.hideLabel}>{this.props.text}</td>);
    } else {
      cell = (<td><CellEditor type={this.props.type} /></td>);
      //
    }

    return (cell);
  }
}
