import React, { Component } from 'react';
import ColorCellDisplay from './ColorCellDisplay';
import DateCellDisplay from './DateCellDisplay';

export default class CellDisplay extends Component {
  render() {
    switch (this.props.labelType) {
      case 'text':
        return (<div className="cell-container">{this.props.text} </div>);
      case 'color':
        return (<ColorCellDisplay text={this.props.text} />);
      case 'date':
        return (<div className="cell-container"><DateCellDisplay text={this.props.text} /></div>);
      default:
        return (<div className="cell-container">{this.props.text}</div>);
    }
  }
}
