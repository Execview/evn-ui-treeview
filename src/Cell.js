import React, { PureComponent } from 'react';


export default class Cell extends PureComponent {
  render() {
    // console.log('meow meow');
    if (this.props.isActive) {
      return (
        <td className={'td-edit ' + (this.props.hasError ? 'red' : '')}>
          {React.cloneElement(this.props.cellTypes[this.props.type].editor, { text: this.props.text, onValidateSave: this.props.onValidateSave, onRemoveActive: this.props.onRemoveActive })}
        </td>);
    }
    return (
      <td
        className={'table-label ' + (this.props.hasError ? 'red ' : ' ') + (this.props.isEditable ? '' : 'no-edit')}
        onClick={() => this.props.setActive(this.props.entry, this.props.col, this.props.rule, this.props.text)}
      >
        {React.cloneElement(this.props.cellTypes[this.props.type].display, { text: this.props.text, hasError: this.props.hasError, errorText: this.props.errorText, wrap: this.props.wrap })}
      </td>);
  }
}

// this.props.cellTypes[this.props.type].editor

// <CellEditor type={this.props.type} text={this.props.cellText} onValidateSave={this.props.onValidateSave} warning={this.props.warning} />

// <CellDisplay text={this.props.text} labelType={this.props.labelType} />

// {React.cloneElement(this.props.cellTypes[this.props.type].editor, { text: this.props.text, onValidateSave: this.props.onValidateSave, warning: this.props.warning })}
