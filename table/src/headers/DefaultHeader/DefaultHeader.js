import React from 'react';
import classes from './DefaultHeader.module.css';

const HeaderCellDisplay = (props) => {
	return (
		<div className={classes['container']}>
			<div className={classes['title']}>{props.data}</div>
		</div>
	);
}

export default HeaderCellDisplay
