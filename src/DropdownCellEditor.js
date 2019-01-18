import React, { Component } from 'react';

export default class DropdownCellEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchString: '',
      displayedRows: this.props.countryDropdown
    };
  }

  onChange(value) {
    const newRows = this.props.countryDropdown.filter(v => v.toLowerCase().includes(value));
    this.setState({ searchString: value, displayedRows: newRows });
  }

  render() {
    return (
      <div className="dropdown">
        <input className="dropdown-input" autoFocus type="text" value={this.state.searchString} onChange={e => this.onChange(e.target.value)} placeholder="Search.." />
        <ul className="dropdown-menu">
          {this.state.displayedRows.map(v => <li className="dropdown-item" key={v} onClick={() => this.props.onSaveCell(this.props.activeCell[0], this.props.activeCell[1], v)}>{v}</li>)}
        </ul>
      </div>);
  }
}
