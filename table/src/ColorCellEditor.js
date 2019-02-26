import React, { Component } from 'react';
import { colors } from './store/constants';
import './ColorCell.css';

export default class ColorCellEditor extends Component {
  render() {
    return (
      <div className="color-dropdown">
        <input type="text" autoFocus onBlur={() => this.props.onValidateSave(this.props.text)} style={{ position: 'absolute', zIndex: -1, border: 0, padding: 0, height: 0 }} />
        <ul className="color-dropdown-menu">
          {Object.keys(colors).map(objKey => <li className={'color-dropdown-item color-' + objKey} key={objKey} onMouseDown={() => this.props.onValidateSave(objKey)}>{colors[objKey]}</li>)}
        </ul>
      </div>
    );
  }
}
