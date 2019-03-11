import React, { Component } from 'react';
import { colors } from '../store/constants';
import './ColorCell.css';

export default class ColorCellDisplay extends Component {
  render() {
    const text = this.props.data || 'grey';
    return (<div className={'no-select progress-' + text} style={{ ...this.props.style, width: this.props.style.width + 10 }}><div className="progress-text">{colors[text]}</div></div>);
  }
}
