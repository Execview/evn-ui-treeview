import React, { PureComponent } from 'react';


export default class Cell extends PureComponent {
  render() {
    // console.log('meow meow');
    const data = this.props.data || '';
    const errorText = this.props.errorText || this.props.errorText === '' ? this.props.errorText : null;
    const style = this.props.style || {};
    const onValidateSave = this.props.onValidateSave || (() => { console.log('give it a function brah'); });
    if (this.props.isActive) {
      return (
        React.cloneElement(this.props.type.editor, { data, onValidateSave }));
    }
    return (
      React.cloneElement(this.props.type.display, { data, errorText, style }));
  }
}

// this.props.cellTypes[this.props.type].editor

// <CellEditor type={this.props.type} text={this.props.cellText} onValidateSave={this.props.onValidateSave} warning={this.props.warning} />

// <CellDisplay text={this.props.text} labelType={this.props.labelType} />

// {React.cloneElement(this.props.cellTypes[this.props.type].editor, { text: this.props.text, onValidateSave: this.props.onValidateSave, warning: this.props.warning })}
