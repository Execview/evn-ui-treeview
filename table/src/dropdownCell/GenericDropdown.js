import React, { Component } from 'react';
import './DropdownCell.css';

export default class DropdownCellEditor extends Component {
  render() {
	const style = this.props.style || {}
	const submit = this.props.submit || ((id)=>{})
    return (
      <div className={style.dropdown || "dropdown"} style={style} onBlur={this.props.onBlur}>
        {this.props.canSearch && <input className={style.dropdownInput || "dropdown-input"} autoFocus type="text" value={this.props.searchString} onChange={e => this.props.onSearchChange(e.target.value)} placeholder={this.props.placeholder || "Search.."} />}
        <ul className={style.dropdownMenu ||"dropdown-menu"}>
          {Object.keys(this.props.options).map((v,index) => <li className={style.dropdownItem ||"dropdown-item"} autoFocus key={index} onMouseDown={() => submit(v)}>{this.props.options[v]}</li>)}
        </ul>
      </div>);
  }
}
