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
	const unknownString = props.dateUnknown || 'Date Unknown'

	const selectedDate = props.data ? new Date(props.data) : new Date();
	
	const displayFormat = props.format || 'ddd DD/MMM/YYYY';
	const dateString = props.data ? moment(props.data).format(displayFormat) : unknownString;
	const submit = (date) => {
		if (date && !isNaN(date.getTime())) {
			props.onValidateSave(date);
		} else {
			props.onValidateSave(null);
		}
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
		<TextCell {...props} data={dateString} onClick={() => { if (props.isEditable) { setOpen(true); } }} />
	);

	const picker = !isMobile ? <DatePicker inline {...datePickerProps} {...extraDatePickerProps} /> : <DatePicker inline withPortal {...datePickerProps} />;

	const editorFormat = 'DD/MM/YYYY';
	const editorContent = moment(selectedDate).format(editorFormat);

	const pickerAndEditor = (
		<OCO OCO={() => submit(props.data)} eventTypes="pointerup">
			<div style={{ height: '100%', position: 'relative' }}>
				<TextCell autoFocus={!isMobile} errorText={props.errorText} classes={props.editorClasses} isEditable={props.isEditable} style={props.style} placeholder={editorFormat} data={editorContent} onValidateSave={(d) => { if (d === editorContent) { return; } submit(moment(d, editorFormat).toDate()); }} />
				<div className="desktop-datepicker">{picker}</div>
			</div>
		</OCO>
	);

	return (
		!open ? display : pickerAndEditor
	);
};

export default DateCell;
