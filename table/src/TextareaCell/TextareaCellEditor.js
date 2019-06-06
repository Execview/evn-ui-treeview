import React, { Component } from 'react';
import './TextareaCell.css';

export default class TextareaCellEditor extends Component {
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
		const classes = this.props.classes || {};
    return (
      <div className={'text-container ' + (classes.container || '')} style={this.props.style}>
        <textarea rows="1" autoFocus onBlur={() => this.props.onValidateSave(this.state.text)} className={'text-input ' + (classes.text || '')} type="text" value={this.state.text} onChange={e => this.onChange(e.target.value)} onKeyPress={e => this.onKeyPress(e)} />

      </div>
    );
  }
}
