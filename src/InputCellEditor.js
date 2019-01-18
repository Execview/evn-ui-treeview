import React, { Component } from 'react';

export default class InputCellEditor extends Component {
  render() {
    if (this.props.warning) {
      return (<textarea rows="1" cols="50" autoFocus className="text-input red" type="text" value={this.props.text} onChange={e => this.props.onInputChange(e.target.value)} onKeyPress={e => this.props.onKeyPress(e)} />);
    }
    return (
      <textarea rows="1" cols="50" autoFocus className="text-input" type="text" value={this.props.text} onChange={e => this.props.onInputChange(e.target.value)} onKeyPress={e => this.props.onKeyPress(e)} />
    );
  }
}
