import React, { Component } from 'react';

export default class InputCellEditor extends Component {
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
    if (e.key === 'Enter' && !(e.shiftKey)) {
      this.props.onValidateSave(this.state.text);
    }
  }

  render() {
    return (
      <textarea rows="1" cols="50" autoFocus onBlur={() => this.props.onValidateSave(this.state.text)} className="text-input" type="text" value={this.state.text} onChange={e => this.onChange(e.target.value)} onKeyPress={e => this.onKeyPress(e)} />
    );
  }
}
