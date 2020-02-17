import React from 'react';
import TextCell from '../TextCell/TextCell';

const Cell = (props) => {
	const errorText = props.errorText || props.errorText === '' ? props.errorText : null;
	const type = props.type || <TextCell />;
	const onValidateSave = props.onValidateSave || ((v) => { console.log('cell returned ' + v); });
	const isEditable = typeof (props.isEditable) === 'boolean' ? props.isEditable : true;
	
	return (
		React.createElement(type.type, { data: props.data, onValidateSave, isEditable, errorText, ...type.props })
	);
};

export default Cell;
