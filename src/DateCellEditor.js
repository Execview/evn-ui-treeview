import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class DateCellEditor extends Component {
  render() {
    const selectedDate = this.props.text ? new Date(this.props.text) : new Date();
    const saveDate = this.props.text ? new Date(this.props.text).toISOString() : '';
    return (<div><DatePicker autoFocus onClickOutside={() => this.props.onValidateSave(saveDate)} selected={selectedDate} onSelect={date => this.props.onValidateSave(date.toISOString())} /></div>);
  }
}
