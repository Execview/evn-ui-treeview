import React, { useState } from 'react';
import errorIcon from '../Resources/icons-info.svg';
import './TextareaCell.css';

const TextareaCellDisplay = (props) => {
	const [showText,setShowText] = useState(false)

	const showError = (e) => {
		e.stopPropagation();
		setShowText(true);
		setTimeout(() => {
			setShowText(false);
		}, 3000);
	};

	const data = props.data || ''
	const style = props.style || {};
	const classes = props.classes || {};
	if (props.errorText !== null) {
		return (
			<div className={'textarea-cell-container no-select cell-error ' + (classes.container || '')} style={props.style}>
				<p className={'cell-text-error ' + (classes.textError || '')} style={{ overflow: style.overflow, textOverflow: style.textOverflow, whiteSpace: style.whiteSpace }}>{data}</p>
				{props.errorText !== '' && <img className="error-icon" src={errorIcon} alt="info" onClick={e => showError(e)} />}
				<div className={'error-info ' + (showText ? 'error-shown' : 'error-hidden')}><p className="error-text">{props.errorText}</p></div>
			</div>
		);
	}
	return <div className={'textarea-cell-container no-select ' + (classes.container || '')} style={props.style}><p className={'textarea-cell-text ' + (classes.text || '')} style={{ overflow: style.overflow, textOverflow: style.textOverflow, whiteSpace: style.whiteSpace }}>{data}</p></div>;
}

export default TextareaCellDisplay;
