import React from 'react';
import DatePicker from 'react-datepicker';
import { isMobile } from 'react-device-detect';
import 'react-datepicker/dist/react-datepicker.css';
import './DateCell.css';

const DateCellEditor = (props) => {
	const submit = (date) => {
		let saveDate = date || props.data;
		saveDate = saveDate && (Object.prototype.toString.apply(saveDate) === '[object Date]' ? saveDate : saveDate.toISOString());
		props.onValidateSave(saveDate);
	};

	const selectedDate = props.data ? new Date(props.data) : new Date();
	const extraDatePickerProps = props.datepickerProps || {};
	const datePickerProps = {
		onClickOutside: (() => submit()),
		selected: selectedDate,
		onSelect: (date => submit(date)),
		popperModifiers: {
			preventOverflow: {
				enabled: true,
				boundariesElement: 'viewport'
			}
		}
	};

	return (
		<div className="text-container" style={props.style}>
			{!isMobile
				? <DatePicker autoFocus {...datePickerProps} {...extraDatePickerProps} />
				: <DatePicker inline withPortal {...datePickerProps} />}
		</div>
	);
};

export default DateCellEditor;
