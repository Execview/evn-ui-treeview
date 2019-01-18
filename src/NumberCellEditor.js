import React, { Component } from 'react';

export default class NumberCellEditor extends Component {
  render() {
    if (this.props.warning) {
      return (<input className="text-input red" autoFocus type="text" value={this.props.text} onChange={e => this.props.onInputChange(e.target.value)} onKeyPress={e => this.props.onKeyPress(e)} />);
    }
    return (
      <input className="text-input" autoFocus type="text" value={this.props.text} onChange={e => this.props.onInputChange(e.target.value)} onKeyPress={e => this.props.onKeyPress(e)} />
    );
  }
}
