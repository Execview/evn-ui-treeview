import React, { useState } from 'react';
import errorIcon from '../../Resources/icons-info.svg';
import './TextareaCell.css';

const TextareaCellDisplay = (props) => {
	const [showText, setShowText] = useState(false);

	const showError = (e) => {
		e.stopPropagation();
		if (props.errorText !== '') {
			setShowText(true);
			setTimeout(() => {
				setShowText(false);
			}, 3000);
		}
	};

	const hasError = typeof (props.errorText) === 'string';
	const data = props.data || '';
	const style = props.style || {};
	const optionalClasses = props.classes || {};
	const emptyText = props.placeholder || 'Type something here...';
	
	const containerClasses = 'textarea-cell-container no-select ' + (optionalClasses.container || '');
	const errorContainerClasses = hasError ? ' cell-error' : '';

	const textClasses = 'textarea-cell-text' + (optionalClasses.text || '');
	const errorTextClasses = hasError ? ' cell-text-error ' + (optionalClasses.textError || '') : '';
	
	const isEditableClasses = props.isEditable ? ' is-editable ' + (optionalClasses.isEditable || '') : '';

	const errorIconEl = hasError && (
		<div>
			<img className="error-icon" src={errorIcon} alt="info" onClick={e => showError(e)} />
			<div className={'error-info ' + (showText ? 'error-shown' : 'error-hidden')}>
				<p className="error-text">{props.errorText}</p>
			</div>
		</div>
	);
	if (!data && props.isEditable) { return <div className={containerClasses + errorContainerClasses} style={props.style}><p className="empty-editable">{emptyText}{errorIconEl}</p></div>; }
	return (
		<div className={containerClasses + errorContainerClasses} style={props.style}>
			<p className={textClasses + errorTextClasses + isEditableClasses} style={{ overflow: style.overflow, textOverflow: style.textOverflow, whiteSpace: style.whiteSpace }}>{data}</p>
			{errorIconEl}
		</div>
	);
};

export default TextareaCellDisplay;
