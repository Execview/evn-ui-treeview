import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import errorIcon from '../../Resources/icons-info.svg';
import classes from './TextCell.module.css';

const TestTextCell = (props) => {
	const [showText, setShowText] = useState(false);
	const data = props.data || '';
	const [text, setText] = useState(data);

	useEffect(() => {
		setText(data);
	}, [data]);

	const inputRef = useRef();

	const getInputFromRef = (ref) => {
		const currentNode = ref.current || {};
		const childNode = (currentNode.childNodes || [])[0] || {};
		return childNode;
	};

	const resizeSelf = () => {
		const childNode = getInputFromRef(inputRef);
		if (childNode.type === 'textarea') {
			childNode.style.height = '1px';
			childNode.style.height = childNode.scrollHeight + 'px';
		}
	};

	useLayoutEffect(resizeSelf);

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

	const onChange = (value) => {
		setText(value);
	};

	const onKeyPress = (e) => {
		
		if (e.key === 'Enter' && !(e.shiftKey)) {
			const childNode = getInputFromRef(inputRef);
			childNode && childNode.blur()
		}
	};

	
	const hasError = typeof (errorText) === 'string';
	const style = props.style || {};
	const optionalClasses = props.classes || {};
	
	const containerClasses = classes['textarea-cell-container'] + ' ' + classes['no-select'] + ' ' + (optionalClasses.container || '') + ' ';
	const errorContainerClasses = hasError ? classes['cell-error'] : '';

	const textClasses = classes['textarea-cell-text'] + ' ' + (props.isEditable ? classes['no-select'] : '') + ' ' + (optionalClasses.text || '') + ' ';
	const errorTextClasses = hasError ? classes['cell-text-error'] + ' ' + (optionalClasses.textError || '') + ' ' : '';
	
	const isEditableClasses = props.isEditable ? classes['is-editable'] + ' ' + (optionalClasses.isEditable || '') + ' ' : '';
	const errorIconEl = hasError && (
		<div>
			<img className={classes['error-icon']} src={errorIcon} alt="info" onClick={e => showError(e)} />
			<div className={classes['error-info'] + ' ' + (showText ? classes['error-shown'] : classes['error-hidden'])}>
				<p className={classes['error-text']}>{errorText}</p>
			</div>
		</div>
	);

	const textareaProps = {
		className: (classes['textarea'] + ' ' + textClasses + errorTextClasses + isEditableClasses),
		onChange: ((e) => { onChange(e.target.value); resizeSelf(); }),
	};

	const inputProps = {
		className: (classes['input'] + ' ' + textClasses + errorTextClasses + isEditableClasses),
	};


	const bothProps = {
		value: text,
		onBlur: (() => { props.onValidateSave(text); }),
		placeholder: (!text && props.isEditable ? (props.placeholder || 'Type something here...') : ''),
		disabled: !props.isEditable,
		onChange: (e => onChange(e.target.value)),
		onKeyPress: onKeyPress,
		autoFocus: props.autoFocus || false
	};

	const inputType = props.wrap ? <textarea row={1} /> : <input />;

	return (
		<div className={containerClasses + errorContainerClasses} style={style} ref={inputRef} onClick={props.onClick}>
			{React.createElement(inputType.type, { ...inputType.props, ...bothProps, ...(props.wrap ? textareaProps : inputProps) })}
			{errorIconEl}
		</div>
	);
};

export default TestTextCell;
