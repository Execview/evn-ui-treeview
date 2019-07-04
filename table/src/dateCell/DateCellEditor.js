import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import { isMobile } from 'react-device-detect';
import 'react-datepicker/dist/react-datepicker.css';
import './DateCell.css';

export default class DateCellEditor extends Component {
	submit = (date) => {
		let saveDate = date || this.props.data;
		saveDate = saveDate && (Object.prototype.toString.apply(saveDate) === '[object Date]' ? saveDate : saveDate.toISOString());
		this.props.onValidateSave(saveDate);
	}

	getDefaultDate = (date) => {
		return date.toISOString().split('T')[0];
	}

	render() {
		const selectedDate = this.props.data ? new Date(this.props.data) : new Date();
		return (
			<div className="text-container" style={this.props.style}>
				{!isMobile
					? <DatePicker onClickOutside={() => this.submit()} selected={selectedDate} onSelect={date => this.submit(date)} autoFocus />
					: <DatePicker onClickOutside={() => this.submit()} selected={selectedDate} onSelect={date => this.submit(date)} inline withPortal />}
			</div>
		);
	}
}

// <input type="date" name="bday" autoFocus defaultValue={this.getDefaultDate(selectedDate)} onChange={e => this.submit(new Date(e.target.value))} onSubmit={()=>{console.log("test")}} />
// onBlur={() => this.props.onValidateSave(saveDate)}
// <input autoFocus className="date-input" type="date" name="bday" value={selectedDate} onChange={e => this.props.onValidateSave(new Date(e.target.value).toISOString())} />

// <DatePicker autoFocus onClickOutside={() => this.props.onValidateSave(saveDate)} selected={selectedDate} onSelect={date => this.props.onValidateSave(date.toISOString())} />
