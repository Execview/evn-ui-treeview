import React, { Component } from 'react';
import CellEditor from './CellEditor';
import CellDisplay from './CellDisplay';

export default class Cell extends Component {
  hideLabel= () => {
    this.props.setActive(this.props.row, this.props.col, this.props.rule, this.props.text);
  }

  render() {
    if (this.props.isActive) {
      return (<td className={this.props.class}><CellEditor type={this.props.type} text={this.props.cellText} onValidateSave={this.props.onValidateSave} warning={this.props.warning} /></td>);
    }
    return (<td className={'table-label ' + this.props.class} onClick={this.hideLabel}><CellDisplay text={this.props.text} labelType={this.props.labelType} /></td>);
  }
}

// this.props.cellTypes[this.props.type].editor

// <CellEditor type={this.props.type} text={this.props.cellText} onInputChange={this.props.onInputChange} onKeyPress={this.props.onKeyPress} onSaveCell={this.props.onSaveCell} activeCell={this.props.activeCell} warning={this.props.warning} />
