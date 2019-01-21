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
    if (this.props.warning) {
      return (<input className="text-input red" autoFocus type="text" value={this.state.text} onChange={e => this.onChange(e.target.value)} onKeyPress={e => this.onKeyPress(e)} />);
    }
    return (
      <input className="text-input" autoFocus type="text" value={this.state.text} onChange={e => this.onChange(e.target.value)} onKeyPress={e => this.onKeyPress(e)} />
    );
  }
}
