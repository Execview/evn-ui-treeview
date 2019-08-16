import React from 'react';
import TextCell from '../TextCell/TextCell';

const Cell = (props) => {
	const data = props.data;
	const errorText = props.errorText || props.errorText === '' ? props.errorText : null;
	const style = props.style || {};
	const type = props.type || <TextCell />;
	const onValidateSave = props.onValidateSave || ((v) => { console.log('cell returned ' + v); });
	const isEditable = typeof (props.isEditable) === 'boolean' ? props.isEditable : true;
	
	return (
		React.createElement(type.type, { ...props, ...type.props, data, onValidateSave, isEditable, errorText, style })
	);
};

export default Cell;
