import React, { Component } from 'react';
import { colors } from './store/constants';

export default class ColorCellDisplay extends Component {
  render() {
    if (colors[this.props.text] !== undefined) {
      return (<div className={'progress progress-' + this.props.text}>{colors[this.props.text]}</div>);
    }
    return (<div className="progress progress-grey">{colors.grey}</div>);
  }
}
