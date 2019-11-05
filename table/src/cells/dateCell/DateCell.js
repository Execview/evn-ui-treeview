import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import { isMobile } from 'react-device-detect';
import { RightClickMenuWrapper } from '@execview/reusable';
import 'react-datepicker/dist/react-datepicker.css';
import './ourDatePicker.css'
import classes from './DateCell.module.css';
import TextCell from '../TextCell/TextCell';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

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
	};

	const extraDatePickerProps = props.datepickerProps || {};

	const datePickerProps = {
		selected: selectedDate,
		onSelect: ((changedDate) => {submit(changedDate); setOpen(false)})
	};	
	
	const display = (
		<div style={{display:'flex', justifyContent:'space-between'}}>
			<TextCell {...props} data={dateString} />
			{props.showCalendar && <FontAwesomeIcon icon={faCalendarAlt}/>}
		</div>
	);

	const editorFormat = 'DD/MM/YYYY';
	const editorContent = moment(selectedDate).format(editorFormat);

	const editor = (
		<TextCell autoFocus={!isMobile} errorText={props.errorText} classes={props.editorClasses} isEditable={props.isEditable} style={props.style} placeholder={editorFormat} data={editorContent} onValidateSave={(d) => { if (d === editorContent) { return; } submit(moment(d, editorFormat).toDate()); }} />
	);
	//remove background from modal datepicker + center.
	return (
		<div className={classes["date-cell-default"]} style={{width:'100%',height:'100%'}}>
			{!open ? display : editor}
			{props.isEditable && (
				<RightClickMenuWrapper
					{...props.rightClickMenuWrapperProps}
					open={open}
					setOpen={setOpen}
					onLeftClick
					takeParentLocation
					OCOProps={{eventTypes:"pointerup"}}
					modalClassName={classes['datepicker-modal']}
					rightClickMenuClassName={classes['rcm']}
					moveBox={[40,0]}
					
				>
					<DatePicker inline {...datePickerProps} {...extraDatePickerProps} />
				</RightClickMenuWrapper>
			)}
			
		</div>
		
	);
};

export default DateCell;
