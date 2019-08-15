import React, { useState } from 'react';
import './GenericAssignCell.css';
import GenericAssign from './GenericAssign';

const GenericAssignCell = (props) => {
	const [open, setOpen] = useState(false);
	const allItems = props.items;
	const data = props.data || [];

	return (
		<div className="generic-cell" onClick={() => setOpen(true)}>
			{React.createElement(props.display.type, { ...props.display.props, isEditable: props.isEditable, allItems, items: data, style: props.style })}
			{open && (
				<GenericAssign allItems={props.items} items={props.data} getOption={props.getOption} isEditable={props.isEditable} getSearchField={props.getSearchField} style={props.style} closeMenu={() => setOpen(false)} onValidateSave={props.onValidateSave} leftTitle={props.leftTitle} rightTitle={props.rightTitle} />
			)}
		</div>
	);
};
export default GenericAssignCell;
