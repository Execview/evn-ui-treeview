import React, { Component } from 'react';
import { colors } from './store/constants';

export default class ColorCellEditor extends Component {
  render() {
    return (
      <div className="color-dropdown">
        <ul className="color-dropdown-menu">
          {Object.keys(colors).map(objKey => <li className={'color-dropdown-item color-' + objKey} key={objKey} onClick={() => this.props.onValidateSave(objKey)}>{colors[objKey]}</li>)}
        </ul>
      </div>
    );
  }
}
