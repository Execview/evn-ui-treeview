import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import { colors } from '../store/constants';
import './ColorCell.css';

class ColorCellEditor extends Component {
  handleClickOutside = () => {
    this.props.onValidateSave(this.props.data);
  };

  render() {
    const width = this.props.style.width >= 137 ? '100%' : 137;
    return (
      <div className="color-dropdown" style={{ width }}>
        <ul className="color-dropdown-menu">
          {Object.keys(colors).map(objKey => <li className={'color-dropdown-item color-' + objKey} key={objKey} onClick={(e) => { e.stopPropagation(); e.preventDefault(); this.props.onValidateSave(objKey); }}>{colors[objKey]}</li>)}
        </ul>
      </div>
    );
  }
}

export default onClickOutside(ColorCellEditor);
