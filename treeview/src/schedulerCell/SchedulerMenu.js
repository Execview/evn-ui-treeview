import React from 'react';
import classes from './SchedulerMenu.module.css';
import { DateCell, InPlaceCell } from '@execview/table';

const SchedulerMenu = (props) => {
	const options = {hour:'Hour', day:'Day', week:'Week', month:'Month', quarter: 'Quarter'};
	const [selected,setSelected] = props.mode
	const [start, setStart] = props.start

	return (
		<div className={classes["scheduler-menu"]}>
			<InPlaceCell permission={4} data={new Date(start)} type={<DateCell isEditable showCalendar rightClickMenuWrapperProps={{dontPortal: true}}/>} onValidateSave={(d) => {console.log(d); setStart(d)}}/>
			<p/>
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