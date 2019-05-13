import React, { Component } from 'react';
import { colors } from '../store/constants';
import './ColorCell.css';

export default class ColorCellDisplay extends Component {
  render() {
    const text = this.props.data || 'grey';
    const smallView = <div className="color-circle-container"><div className={'color-circle circle-' + text} /></div>;
    const xd = this.props.style.width >= 135 ? colors[text] : null;
    const bigView = <div className={'no-select progress-' + text} style={this.props.style}><div className="progress-text">{colors[text]}</div></div>;
    const toRender = this.props.style.width >= 95 ? bigView : smallView;
    return (toRender);
  }
}
