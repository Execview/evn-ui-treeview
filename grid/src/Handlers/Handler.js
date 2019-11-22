import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faCog } from '@fortawesome/free-solid-svg-icons';
import classes from './Handler.module.css'

const Handler = (props) => {
	return (
		<div className={classes['handler']}>
			<div className={`${props.draggableHandle} ${classes['handler-bar']}`}>
				<FontAwesomeIcon className={classes['drag-icon']} icon={faBars}/>
				<FontAwesomeIcon className={classes['cog']} icon={faCog}/>
			</div>
			{props.children}
		</div>
	)
}

export default Handler