import React, { useState } from 'react';
import classes from './SchedulerMenu.module.css';
import { InPlaceCell } from '@execview/reusable'
import { DateCellDisplay, DateCellEditor } from '@execview/table'

const SchedulerMenu = (props) => {
	const options = {hour:'Hour', day:'Day', week:'Week', month:'Month'};
	const [selected,setSelected] = props.mode
	const [start, setStart] = props.start

	const datepickerExtraProps = {
		popperModifiers:{
			offset: {
				enabled: true,
				offset: '-50px, 0px' 
			},
			preventOverflow: {
				enabled: true,
				boundariesElement: 'viewport'
			}
		}
	};
	return (
		<div className={classes["scheduler-menu"]}>
			<div className={classes['datepicker-container']}>
				<InPlaceCell 
					type={{display:<DateCellDisplay/>, editor:<DateCellEditor datepickerProps={datepickerExtraProps}/>}}
					data={start}
					onValidateSave={(d)=>setStart(d)}
				/>
			</div>
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