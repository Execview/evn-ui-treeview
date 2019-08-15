import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { isMobile } from 'react-device-detect';
import { OCO } from '@execview/reusable';
import 'react-datepicker/dist/react-datepicker.css';
import './DateCell.css';
import TextCell from '../TextCell/TextCell';

const DateCell = (props) => {
	const [open, setOpen] = useState(false);
	const [selectedDate, setSelectedDate] = useState(new Date());
	useEffect(() => {
		setSelectedDate(props.data ? new Date(props.data) : new Date());
	}, [props.data]);

	const displayFormat = props.format || 'ddd DD/MMM/YYYY';
	const dateString = props.data ? moment(props.data).format(displayFormat) : 'Date Unknown';

	const submit = (date) => {
		props.onValidateSave(date);
		setOpen(false);
	};

	const extraDatePickerProps = props.datepickerProps || {};
	const datePickerProps = {
		selected: selectedDate,
		onSelect: ((changedDate) => { submit(changedDate); }),
		popperModifiers: {
			preventOverflow: {
				enabled: true,
				boundariesElement: 'viewport'
			}
		}
	};	
	
	const display = (
		<TextCell {...props} data={dateString} onClick={() => setOpen(true)} />
	);

	const picker = !isMobile ? <DatePicker inline {...datePickerProps} {...extraDatePickerProps} /> : <DatePicker inline withPortal {...datePickerProps} />;

	const editorFormat = 'DD/MM/YYYY';
	const editorContent = moment(selectedDate).format(editorFormat);

	const pickerAndEditor = (
		<OCO OCO={() => setOpen(false)} eventTypes="click">
			<div style={{ height: '100%' }}>
				<TextCell autoFocus={!isMobile} errorText={props.errorText} isEditable={props.isEditable} style={props.style} placeholder={editorFormat} data={editorContent} onValidateSave={(d) => { if (d === editorContent) { return; } submit(moment(d, editorFormat).toDate()); }} />
				<div className="desktop-datepicker">{picker}</div>
			</div>
		</OCO>
	);

	return (
		!open ? display : pickerAndEditor
	);
};

export default DateCell;
