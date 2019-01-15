import React, { Component } from 'react';
import InputCellEditor from './InputCellEditor';
import DropdownCellEditor from './DropdownCellEditor';
import NumberCellEditor from './NumberCellEditor';

export default class CellEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let element;
    switch (this.props.type) {
      case 'text': {
        element = (<InputCellEditor />);
        break;
      }
      case 'number': {
        element = (<NumberCellEditor />);
        break;
      }
      case 'dropdown': {
        element = (<DropdownCellEditor />);
        break;
      }
      default:
        element = null;
    }
    return (element);
  }
}
