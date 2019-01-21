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
        element = (<InputCellEditor text={this.props.text} onValidateSave={this.props.onValidateSave} warning={this.props.warning} />);
        break;
      }
      case 'number': {
        element = (<NumberCellEditor text={this.props.text} onValidateSave={this.props.onValidateSave} warning={this.props.warning} />);
        break;
      }
      case 'dropdown': {
        element = (<DropdownCellEditor countryDropdown={countries} onValidateSave={this.props.onValidateSave} />);
        break;
      }
      case 'color': {
        element = (<ColorCellEditor onValidateSave={this.props.onValidateSave} />);
        break;
      }
      case 'date': {
        element = (<DateCellEditor text={this.props.text} onValidateSave={this.props.onValidateSave} />);
        break;
      }
      default:
        element = null;
    }
    return (element);
  }
}
