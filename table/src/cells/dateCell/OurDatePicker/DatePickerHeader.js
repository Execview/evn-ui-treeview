import React from 'react'
import moment from 'moment'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleRight, faAngleLeft, faAngleDoubleRight, faAngleDoubleLeft } from '@fortawesome/free-solid-svg-icons';
import InPlaceCell from '../../InPlaceCell/InPlaceCell';
import DropdownCell from '../../DropdownCell/DropdownCell';
import classes from './DatePickerHeader.module.css'

const DatePickerHeader = (props) => {
	const date = props.date
	const yearRange = 40

	const getDropdownScroll = (d) => {
		return <div>{d}</div>
	}
	
	const selectedYear = moment(date).year()
	const months = moment.monthsShort()
	const selectedMonth = months[moment(date).month()]
	const years = [...Array(yearRange).keys()].map(i=>i+selectedYear-Math.floor(yearRange/2))

	const yearOptions = Object.fromEntries(years.map(y=>[y,getDropdownScroll(y)]))
	const monthOptions = Object.fromEntries(months.map(m=>[m,getDropdownScroll(m)]))

	return (
		<div className={classes['custom-header']}>
			<FontAwesomeIcon className={classes['arrow']} icon={faAngleDoubleLeft} onClick={props.decreaseYear} />
			<FontAwesomeIcon className={classes['arrow']} icon={faAngleLeft} onClick={props.decreaseMonth} />
			<div className={classes['date']}>
				{/* <div>{moment(date).format('MMM')}</div> */}
				<InPlaceCell onValidateSave={(m)=>props.changeMonth(months.indexOf(m))} data={selectedMonth} type={<DropdownCell options={monthOptions} rightClickMenuWrapperProps={{dontPortal: true, rcmClassName: classes['month-picker-rcm'], moveBox:[100,15], slideBox:75}}/>} />
				<InPlaceCell onValidateSave={props.changeYear} data={selectedYear} type={<DropdownCell options={yearOptions} rightClickMenuWrapperProps={{dontPortal: true, rcmClassName: classes['year-picker-rcm'], moveBox:[135,15], slideBox:50}}/>} />
				
			</div>
			<FontAwesomeIcon className={classes['arrow']} icon={faAngleRight} onClick={props.increaseMonth} />
			<FontAwesomeIcon className={classes['arrow']} icon={faAngleDoubleRight} onClick={props.increaseYear} />
		</div>
	)
}

export default DatePickerHeader