import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import classes from './UserHeader.module.css'

const UserHeader = (props) => {
	return (
		<div className={classes["container"]} title="Assigned Users">
			<FontAwesomeIcon icon={faUserCircle} className={classes["user-header"]} />
		</div>
	);
}

export default UserHeader
