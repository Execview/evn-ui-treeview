import React, { useState } from 'react';
import classes from './SchedulerMenu.module.css';

const SchedulerMenu = (props) => {
	const options = ['1 Week', '2 Weeks', 'Month', 'Quarter'];
	const [selected,setSelected] = useState(0); 
	return (
		<div className={classes["scheduler-menu"]}>
			Test
			<div>
				<ul className={classes['items-list']}>
					{options.map((item,key) => 
						<li 
							key={item} 
							className={classes['item']+' '+(selected === key ? classes['green'] : '')}
							onClick={() => setSelected(key)}
						>{item}</li>
					)}
				</ul>
			</div>
		</div>
	)
}

export default SchedulerMenu