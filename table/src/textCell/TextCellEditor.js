import React, { Component } from 'react';
import './TextCell.css';

export default class TextCellEditor extends Component {
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
    if (e.key === 'Enter') {
      this.props.onValidateSave(this.state.text);
    }
  }

  render() {
		const classes = this.props.classes || {};
    return (
      <div className={'text-container ' + (classes.container || '')} style={this.props.style}>
        <input className={'number-input ' + (classes.text || '')} onBlur={() => this.props.onValidateSave(this.state.text)} autoFocus type="text" value={this.state.text} onChange={e => this.onChange(e.target.value)} onKeyPress={e => this.onKeyPress(e)} />
      </div>
    );
  }
}
