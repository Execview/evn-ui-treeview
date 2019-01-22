import React, { PureComponent } from 'react';


export default class Cell extends PureComponent {
  render() {
    if (this.props.isActive) {
      return (
        <td className={this.props.red ? 'red' : ''}>
          {React.cloneElement(this.props.cellTypes[this.props.type].editor, { text: this.props.text, onValidateSave: this.props.onValidateSave })}
        </td>);
    }
    return (
      <td
        className={'table-label ' + (this.props.wrap ? 'toggle-wrap ' : ' ') + (this.props.red ? 'red' : '')}
        onClick={() => this.props.setActive(this.props.entry, this.props.col, this.props.rule, this.props.text)}
      >
        {React.cloneElement(this.props.cellTypes[this.props.type].display, { text: this.props.text })}
      </td>);
  }
}

// this.props.cellTypes[this.props.type].editor

// <CellEditor type={this.props.type} text={this.props.cellText} onValidateSave={this.props.onValidateSave} warning={this.props.warning} />

// <CellDisplay text={this.props.text} labelType={this.props.labelType} />

// {React.cloneElement(this.props.cellTypes[this.props.type].editor, { text: this.props.text, onValidateSave: this.props.onValidateSave, warning: this.props.warning })}
