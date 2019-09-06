import React, { Component, useState } from 'react';
import classes from './SchedulerMenu.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import DatePicker from 'react-datepicker';
import moment from 'moment';

const SchedulerMenu = (props) => {
	const options = {hour:'Hour', day:'Day', week:'Week', month:'Month', quarter: 'Quarter'};
	const [selected,setSelected] = props.mode
	const [start, setStart] = props.start

	const datepickerExtraProps = {
		offset: {
			enabled: true,
			offset: '-50px, 0px' 
		},
		preventOverflow: {
			enabled: true,
			boundariesElement: 'viewport'
		}
	};

	class IconAdd extends Component {
		render() {
			return <div onClick={this.props.onClick} style={{display:'flex',cursor:'pointer'}}><p className={classes['selected-date']}>{moment(start).format('ddd D/MMM/YY')}</p><FontAwesomeIcon icon={faCalendarAlt}/></div>

		}
	}

	return (
		<div className={classes["scheduler-menu"]}>
			
			<DatePicker 
				customInput={<IconAdd />}
				selected={new Date(start)}
				onChange={(d)=>setStart(d)}
				popperModifiers={datepickerExtraProps}
			/>
			<div>
				<ul className={classes['items-list']}>
					{Object.keys(options).map((key) => 
						<li 
							key={key} 
							className={classes['item']+' '+(selected === key ? classes['selected'] : '')}
							onClick={() => setSelected(key)}
						>{options[key]}</li>
					)}
				</ul>
			</div>
		</div>
	)
}

export default SchedulerMenu