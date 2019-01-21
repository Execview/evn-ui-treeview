import React, { Component } from 'react';
import ColorCellDisplay from './ColorCellDisplay';
import DateCellDisplay from './DateCellDisplay';
import InputCellDisplay from './InputCellDisplay';

export default class CellDisplay extends Component {
  render() {
    switch (this.props.labelType) {
      case 'text':
        return (<InputCellDisplay text={this.props.text} />);
      case 'color':
        return (<ColorCellDisplay text={this.props.text} />);
      case 'date':
        return (<DateCellDisplay text={this.props.text} />);
      default:
        return (<InputCellDisplay text={this.props.text} />);
    }
  }
}
