import React, { Component } from 'react';
import './DropdownCell.css';

export default class DropdownCellEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      displayedRows: this.props.dropdownList
    };
  }

  onChange(value) {
    const newRows = this.props.dropdownList.filter(v => v.toLowerCase().includes(value));
    this.setState({ searchString: value, displayedRows: newRows });
  }

  render() {
    return (
      <div className="dropdown" style={this.props.style} onBlur={() => this.props.onValidateSave(this.props.data)}>
        <input className="dropdown-input" autoFocus type="text" value={this.state.searchString} onChange={e => this.onChange(e.target.value)} placeholder="Search.." />
        <ul className="dropdown-menu">
          {this.state.displayedRows.map(v => <li className="dropdown-item" autoFocus key={v} onMouseDown={() => this.props.onValidateSave(v)}>{v}</li>)}
        </ul>
      </div>);
  }
}
