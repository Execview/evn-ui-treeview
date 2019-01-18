import React, { Component } from 'react';
import InputCellEditor from './InputCellEditor';
import DropdownCellEditor from './DropdownCellEditor';
import NumberCellEditor from './NumberCellEditor';
import ColorCellEditor from './ColorCellEditor';
import DateCellEditor from './DateCellEditor';
import { countries } from './store/constants';

export default class CellEditor extends Component {
  render() {
    let element;
    switch (this.props.type) {
      case 'text': {
        element = (<InputCellEditor text={this.props.text} onInputChange={this.props.onInputChange} onKeyPress={this.props.onKeyPress} warning={this.props.warning} />);
        break;
      }
      case 'number': {
        element = (<NumberCellEditor text={this.props.text} onInputChange={this.props.onInputChange} onKeyPress={this.props.onKeyPress} warning={this.props.warning} />);
        break;
      }
      case 'dropdown': {
        element = (<DropdownCellEditor countryDropdown={countries} onSaveCell={this.props.onSaveCell} activeCell={this.props.activeCell} />);
        break;
      }
      case 'color': {
        element = (<ColorCellEditor onSaveCell={this.props.onSaveCell} activeCell={this.props.activeCell} />);
        break;
      }
      case 'date': {
        element = (<DateCellEditor onSaveCell={this.props.onSaveCell} activeCell={this.props.activeCell} text={this.props.text} />);
        break;
      }
      default:
        element = null;
    }
    return (element);
  }
}
