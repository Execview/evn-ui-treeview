import React from 'react';
import TextCell from '../TextCell/TextCell';

const Cell = (props) => {
	const errorText = props.errorText || props.errorText === '' ? props.errorText : null;
	const type = props.type || <TextCell wrap={props.wrap} />
	const onValidateSave = props.onValidateSave || ((v) => { console.log('cell returned ' + v); });
	const permission = props.permission || 1
	return (
		React.createElement(type.type, { data: props.data, onValidateSave, permission, errorText, ...type.props })
	);
};

export default Cell

