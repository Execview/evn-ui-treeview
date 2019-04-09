import React, { Component } from 'react';
import onClickOutside from 'react-onclickoutside';
import './DropdownCell.css';

class GenericDropDown extends Component {
  handleClickOutside = this.props.onBlur;
  
  render() {
    const style = this.props.style || {};
    const submit = this.props.submit || (() => {});
    return (
      <div className={style.dropdown || 'dropdown'} style={style}>
        <div className="dropdown-content">
          {this.props.canSearch && <input className={style.dropdownInput || 'dropdown-input'} autoFocus={this.props.autoFocus} type="text" value={this.props.searchString} onChange={e => this.props.onSearchChange(e.target.value)} placeholder={this.props.placeholder || 'Search..'} />}
          <ul className={style.dropdownMenu || 'dropdown-menu'}>
            {Object.keys(this.props.options).map((v, index) => <li className={style.dropdownItem || 'dropdown-item'} key={index} onClick={e => submit(v)}>{this.props.options[v]}</li>)}
          </ul>
        </div>
      </div>);
  }
}

export default onClickOutside(GenericDropDown);
