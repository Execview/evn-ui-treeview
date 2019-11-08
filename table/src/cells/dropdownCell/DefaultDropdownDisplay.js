import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import classes from './DefaultDropdownDisplay.module.css';

const defaultDropdownDisplay = (props) => {
	const data = props.data || '';
	const looksEditable = props.looksEditable;
	const showCaret = props.showCaret;
	const style = props.style || {};
	const optionalClasses = props.classes || {};

	const containerClass = optionalClasses.container || classes['container'];
	const looksEditableClass = optionalClasses.looksEditable || classes['looks-editable'];

	const containerClasses = containerClass + ' ' + (looksEditable ? looksEditableClass : '');

	const caret = <FontAwesomeIcon icon={faCaretDown} className={classes['caret']} />;

	return (
		<div className={containerClasses} style={{ ...style, width: style.width }}>
			<div>{data}</div>
			{showCaret && caret}
		</div>
	);
};

export default defaultDropdownDisplay;
