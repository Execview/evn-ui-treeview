import React, { Component } from 'react';

export default class NumberCellEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.text
    };
  }

  onChange(value) {
    this.setState({ text: value });
  }

  onKeyPress(e) {
    if (e.key === 'Enter') {
      this.props.onValidateSave(this.state.text);
    }
  }

  render() {
    return (
      <input className="text-input" autoFocus type="text" onBlur={() => this.props.onValidateSave(this.state.text)} value={this.state.text} onChange={e => this.onChange(e.target.value)} onKeyPress={e => this.onKeyPress(e)} />
    );
  }
}
