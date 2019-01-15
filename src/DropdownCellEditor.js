import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionTypes';

// class DropdownCellEditor extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }
//
//   render() {
//     return (
//       <div>
//         <select value="pickOption" onChange={e => this.props.onSaveCell(this.props.activeCell[0], this.props.activeCell[1], e.target.value)}>
//           <option value="pickOption">Pick an option</option>
//           {this.props.countryDropdown.map(option => <option value={option} key={option}>{option}</option>)}
//         </select>
//       </div>
//     );
//   }
// }

class DropdownCellEditor extends Component {
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

const mapStateToProps = (state) => {
  return {
    activeCell: state.activeCell,
    countryDropdown: state.countryDropdown,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onSaveCell: (row, col, text) => dispatch({ type: actionTypes.SAVE_CELL, row, col, text })
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(DropdownCellEditor);
