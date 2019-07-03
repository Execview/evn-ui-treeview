import React, { useState } from 'react';
import classes from './SchedulerMenu.module.css';
import { InPlaceCell } from '@execview/reusable'
import { DateCellDisplay, DateCellEditor } from '@execview/table'

const SchedulerMenu = (props) => {
	const options = ['Day', 'Week', 'Month', 'Quarter'];
	const [selected,setSelected] = props.mode
	const [start, setStart] = props.start
	console.log(props)
	return (
		<div className={classes["scheduler-menu"]}>
			<InPlaceCell 
				type={{display:<DateCellDisplay/>, editor:<DateCellEditor/>}}
				data={start}
				onValidateSave={(d)=>{console.log(d);props.setStart(d)}}
			/>
			<div>
				<ul className={classes['items-list']}>
					{options.map((item,index) => 
						<li 
							key={item} 
							className={classes['item']+' '+(selected === index ? classes['selected'] : '')}
							onClick={() => setSelected(index)}
						>{item}</li>
					)}
				</ul>
			</div>
		</div>
	)
}

export default SchedulerMenu