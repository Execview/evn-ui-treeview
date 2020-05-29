import React from 'react'
import DatePicker from 'react-datepicker';
import './OurDatePicker.css'
import DatePickerHeader from './DatePickerHeader'

const OurDatePicker = (props) => {
	const customHeader = ({...p}) => <DatePickerHeader {...p}/>

	const otherProps = {
		todayButton: "Today",
		renderCustomHeader: customHeader
	}
	return (
		<DatePicker {...props} {...otherProps}/>
	)
}

export default OurDatePicker
