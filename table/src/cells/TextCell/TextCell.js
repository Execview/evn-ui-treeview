import React, { useState, useEffect } from 'react';
import errorIcon from '../../Resources/icons-info.svg';
import classes from './TextCell.module.css';

const TextCell = (props) => {
	const [showText, setShowText] = useState(false);
	const [text, setText] = useState('');
	useEffect(() => setText(props.data || ''), [props.data]);
	const [textareaOpen, setTextareaOpen] = useState((props.autoFocus && props.wrap) || false);
	const style = props.style || {};
	const errorText = props.errorText;
	const showError = (e) => {
		e.stopPropagation();
		if (errorText !== '') {
			setShowText(true);
			setTimeout(() => {
				setShowText(false);
			}, 3000);
		}
	};

	const onKeyPress = (e) => {
		const childNode = e.target;
		if (e.key === 'Enter' && !(e.shiftKey)) {
			childNode && childNode.blur()
		}
	};

	const submitTextContent = (e) => {
		const val = e.target.value;
		props.onValidateSave(val);
		setTextareaOpen(false);
	};

	const resizeSelf = (e) => {
		const childNode = e.target;
		if (childNode.type === 'textarea') {
			childNode.style.height = '1px';
			childNode.style.height = childNode.scrollHeight + 'px';
		}
	};

	
	const hasError = typeof (errorText) === 'string';
	
	const optionalClasses = props.classes || {};
	
	const containerClasses = classes['default-cell-container'] + ' ' + (optionalClasses.container || classes['textarea-cell-container']) + ' ' + classes['no-select'] + ' ';
	const errorContainerClasses = hasError ? classes['cell-error'] : '';

	const textClasses = classes['textarea-cell-text'] + ' ' + (props.isEditable ? classes['no-select'] : '') + ' ' + (optionalClasses.text || '') + ' ';
	const errorTextClasses = hasError ? classes['cell-text-error'] + ' ' + (optionalClasses.textError || '') + ' ' : '';
	
	const isEditableClasses = props.isEditable ? classes['is-editable'] + ' ' + (optionalClasses.isEditable || '') + ' ' : '';
	const errorIconEl = hasError && (
		<div>
			<img className={classes['error-icon']} src={errorIcon} alt="info" onClick={e => showError(e)} />
			<div className={classes['error-info'] + ' ' + optionalClasses.errorText + ' ' + (showText ? classes['error-shown'] : classes['error-hidden'])}>
				<p className={classes['error-text']}>{errorText}</p>
			</div>
		</div>
	);

	const placeholderText = (props.placeholder || 'Type something here...');

	const textareaProps = {
		className: (classes['textarea'] + ' ' + textClasses + errorTextClasses + isEditableClasses + (!textareaOpen && !text && props.isEditable ? classes['empty-editable'] : '')),
		autoFocus: true,

		onFocus: resizeSelf
	};

	const inputProps = {
		className: (classes['input'] + ' ' + textClasses + errorTextClasses + isEditableClasses),
		disabled: !props.isEditable,
		autoFocus: props.autoFocus || false,
		type: props.password ? 'password' : 'text'
	};

	const bothProps = {
		value: text,
		onChange: ((e) => { setText(e.target.value); if (props.onChange) { props.onChange(e.target.value); } }),
		onBlur: (submitTextContent),
		onKeyPress,
		placeholder: (!text && props.isEditable ? placeholderText : ''),	
	};

	const textareaInput = !textareaOpen ? <p style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center' }} onClick={() => { if (props.isEditable) { setTextareaOpen(true); } }}>{text || (props.isEditable && placeholderText)}</p> : <textarea />;

	const inputType = props.wrap ? textareaInput : <input />;

	return (
		<div className={containerClasses + errorContainerClasses} style={style} onClick={props.onClick}>
			{React.createElement(inputType.type, { ...inputType.props, ...bothProps, ...(props.wrap ? textareaProps : inputProps) })}
			{errorIconEl}
		</div>
	);
};

export default TextCell;
