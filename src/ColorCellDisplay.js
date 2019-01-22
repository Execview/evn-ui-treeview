import React, { Component } from 'react';
import { colors } from './store/constants';

export default class ColorCellDisplay extends Component {
  render() {
    const text = this.props.text || 'grey';
    return (<div className={'progress progress-' + text}>{colors[text]}</div>);
  }
}
