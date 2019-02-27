import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './DateCell.css';

export default class DateCellEditor extends Component {
  render() {
    const selectedDate = this.props.data ? new Date(this.props.data) : new Date();
    const saveDate = this.props.data ? new Date(this.props.data).toISOString() : '';
    return (<div className="text-container" style={this.props.style}><DatePicker autoFocus onClickOutside={() => this.props.onValidateSave(saveDate)} selected={selectedDate} onSelect={date => this.props.onValidateSave(date.toISOString())} /></div>);
  }
}
// onBlur={() => this.props.onValidateSave(saveDate)}
// <input autoFocus className="date-input" type="date" name="bday" value={selectedDate} onChange={e => this.props.onValidateSave(new Date(e.target.value).toISOString())} />

// <DatePicker autoFocus onClickOutside={() => this.props.onValidateSave(saveDate)} selected={selectedDate} onSelect={date => this.props.onValidateSave(date.toISOString())} />
