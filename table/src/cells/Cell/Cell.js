import React from 'react';
import TextareaCellDisplay from '../TextAreaCell/TextareaCellDisplay';
import TextCellEditor from '../TextAreaCell/TextareaCellEditor';

const Cell = (props) => {
	const data = props.data;
	const errorText = props.errorText || props.errorText === '' ? props.errorText : null;
	const style = props.style || {};
	const type = {};
	type.display = (props.type && props.type.display) || <TextareaCellDisplay />;
	type.editor = (props.type && props.type.editor) || <TextCellEditor />;
	const onValidateSave = props.onValidateSave || (() => { console.log('cell needs onValidateSave brah'); });
	const isEditable = typeof (props.isEditable) === 'boolean' ? props.isEditable : true;
	if (props.isActive) {
		return (
			React.createElement(type.editor.type, { ...type.editor.props, data, onValidateSave, isEditable, errorText, style }));
	}
	return (
		React.createElement(type.display.type, { ...type.display.props, data, onValidateSave, isEditable, errorText, style }));
};

export default Cell;
