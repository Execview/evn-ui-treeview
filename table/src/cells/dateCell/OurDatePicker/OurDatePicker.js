import React from 'react'
import moment from 'moment'
import DatePicker from 'react-datepicker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import './OurDatePicker.css'
import classes from './OurDatePicker.module.css'
import InPlaceCell from '../../InPlaceCell/InPlaceCell';
import DropdownCell from '../../DropdownCell/DropdownCell';

const OurDatePicker = (props) => {

	const customHeader = ({
		date,
		changeYear,
		changeMonth,
		decreaseMonth,
		increaseMonth,
		decreaseYear,
		increaseYear
	}) => {
		const selectedYear = moment(date).year()
		let yearOptions = {}
		const yearRange = 40
		for(let i=0; i<yearRange; i++){
			const option = (selectedYear-yearRange/2+i).toString()
			yearOptions[option] = option
		}

		const monthOptions = moment.monthsShort()
		
		const selectedMonth = monthOptions[moment(date).month()]

		console.log(selectedMonth)

		const onYearSave = (y) => {
			changeYear(y)
		}
		const onMonthSave = (y) => {
			changeMonth(monthOptions.indexOf(y))
		}

		return (
			<div className={classes['custom-header']}>
				<FontAwesomeIcon className={classes['arrow']} icon={faAngleDoubleLeft} onClick={decreaseYear} />
				<FontAwesomeIcon className={classes['arrow']} icon={faAngleLeft} onClick={decreaseMonth} />
				<div className={classes['date']}>
					{/* <div>{moment(date).format('MMM')}</div> */}
					<InPlaceCell onValidateSave={onMonthSave} data={selectedMonth} type={<DropdownCell options={monthOptions} rightClickMenuWrapperProps={{dontPortal: true, rcmClassName: classes['month-picker-rcm'], moveBox:[100,15], slideBox:75}}/>} />
					<InPlaceCell onValidateSave={onYearSave} data={selectedYear} type={<DropdownCell options={yearOptions} rightClickMenuWrapperProps={{dontPortal: true, rcmClassName: classes['year-picker-rcm'], moveBox:[135,15], slideBox:50}}/>} />
					
				</div>
				<FontAwesomeIcon className={classes['arrow']} icon={faAngleRight} onClick={increaseMonth} />
				<FontAwesomeIcon className={classes['arrow']} icon={faAngleDoubleRight} onClick={increaseYear} />
			</div>
		)
	}


	const otherProps = {
		todayButton: "Today",
		renderCustomHeader: customHeader
	}
	return (
		<DatePicker {...props} {...otherProps}/>
	)
}

export default OurDatePicker