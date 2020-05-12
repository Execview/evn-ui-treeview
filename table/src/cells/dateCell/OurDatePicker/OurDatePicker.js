import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft } from '@fortawesome/free-solid-svg-icons';
import './OurDatePicker.css'
import classes from './OurDatePicker.module.css'
import InPlaceCell from '../../InPlaceCell/InPlaceCell';
import DropdownCell from '../../DropdownCell/DropdownCell';

const OurDatePicker = (props) => {

	const customHeader = ({
		date,
		changeYear,
		decreaseMonth,
		increaseMonth
	}) => {
		const selectedYear = moment(date).year()
		let yearOptions = {}
		const yearRange = 40
		for(let i=0; i<yearRange; i++){
			const option = (selectedYear-yearRange/2+i).toString()
			yearOptions[option] = option
		}
		const onSave = (y) => {
			console.log(y)
			changeYear(y)
		}

		return (
			<div className={classes['custom-header']}>
				<FontAwesomeIcon className={classes['month-arrow']} icon={faAngleLeft} onClick={decreaseMonth} />
				<div className={classes['date']}>
					<div>{moment(date).format('MMM')}</div>
					<InPlaceCell onValidateSave={onSave} className={'year-dropdown'} data={selectedYear} type={<DropdownCell options={yearOptions} rightClickMenuWrapperProps={{dontPortal: true, rcmClassName: classes['date-picker-rcm'], moveBox:[115,15], slideBox:50}}/>} />
				</div>
				<FontAwesomeIcon className={classes['month-arrow']} icon={faAngleRight} onClick={increaseMonth} />
			</div>
		)
	}


	const otherProps = {
		todayButton: "Today",
		showYearDropdown: true,
		renderCustomHeader: customHeader
	}
	return (
		<DatePicker {...props} {...otherProps}/>
	)
}

export default OurDatePicker