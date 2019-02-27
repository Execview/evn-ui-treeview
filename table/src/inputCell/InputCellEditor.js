import React, { Component } from 'react';
import './InputCell.css';

export default class InputCellEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: this.props.data
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
  // onBlur={() => this.props.onValidateSave(this.state.text)}

  render() {
    return (
      <div className="text-container" style={this.props.style}>
        <textarea rows="1" autoFocus onBlur={() => this.props.onValidateSave(this.state.text)} className="text-input" type="text" value={this.state.text} onChange={e => this.onChange(e.target.value)} onKeyPress={e => this.onKeyPress(e)} />

      </div>
    );
  }
}
