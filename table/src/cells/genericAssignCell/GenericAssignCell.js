import React, { useState } from 'react';
import './GenericAssignCell.css';
import Panel from '../../Panel/Panel';
import { OCO } from '@execview/reusable';
import GenericAssign from './GenericAssign';

const GenericAssignCell = (props) => {
	const [open, setOpen] = useState(false);
	const allItems = props.items;
	const data = props.data || [];

	return (
		<div className="generic-cell" onClick={() => setOpen(true)}>
			{React.createElement(props.display.type, { ...props.display.props, isEditable: props.isEditable, allItems, items: data, style: props.style })}
			{open && (
				<OCO OCO={() => setOpen(false)}>
					<Panel panelClass="generic-panel" caretClass="generic-caret">
						<GenericAssign allItems={props.items} items={props.data} getOption={props.getOption} isEditable={props.isEditable} getSearchField={props.getSearchField} style={props.style} onValidateSave={props.onValidateSave} leftTitle={props.leftTitle} rightTitle={props.rightTitle} />
					</Panel>
				</OCO>
			)}
		</div>
	);
};
export default GenericAssignCell;
