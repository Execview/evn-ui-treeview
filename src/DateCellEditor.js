import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

export default class DateCellEditor extends Component {
  render() {
    const selectedDate = this.props.text ? new Date(this.props.text) : new Date();
    return (<div><DatePicker autoFocus selected={selectedDate} onSelect={date => this.props.onValidateSave(date.toISOString())} /></div>);
  }
}
