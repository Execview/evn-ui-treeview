import React from 'react';
import classes from './Panel.module.css';

const Panel = (props) => {
	return (
		<div className={`${classes['panel']} ${!props.hideCaret ? classes['panel-padding'] : ''} ${props.panelClass}`}>
			{!props.hideCaret && <div className={`${classes['absolute-caret']} ${props.caretClass}`} />}
			{props.children}
		</div>
	);
};

export default Panel;
