import React, { PureComponent } from 'react';


export default class Cell extends PureComponent {
  render() {
    // console.log('meow meow');
    if (this.props.isActive) {
      return (
        React.cloneElement(this.props.type.editor, { text: this.props.text, onValidateSave: this.props.onValidateSave }));
    }
    return (
      React.cloneElement(this.props.type.display, { text: this.props.text, errorText: this.props.errorText, style: this.props.style }));
  }
}

// this.props.cellTypes[this.props.type].editor

// <CellEditor type={this.props.type} text={this.props.cellText} onValidateSave={this.props.onValidateSave} warning={this.props.warning} />

// <CellDisplay text={this.props.text} labelType={this.props.labelType} />

// {React.cloneElement(this.props.cellTypes[this.props.type].editor, { text: this.props.text, onValidateSave: this.props.onValidateSave, warning: this.props.warning })}
