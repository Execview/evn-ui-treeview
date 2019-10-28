import React from 'react';
import './GenericAssignCell.css';
import RightClickMenuWrapper from './RightClickMenu/RightClickMenuWrapper';
import GenericAssign from './GenericAssign';

const GenericAssignCell = (props) => {
	const allItems = props.items;
	const data = props.data || [];

	return (
		<div className="generic-cell">
			{React.createElement(props.display.type, { ...props.display.props, isEditable: props.isEditable, allItems, items: data, style: props.style })}
			<RightClickMenuWrapper takeParentLocation>
				<GenericAssign allItems={props.items} items={props.data} getOption={props.getOption} isEditable={props.isEditable} getSearchField={props.getSearchField} style={props.style} onValidateSave={props.onValidateSave} leftTitle={props.leftTitle} rightTitle={props.rightTitle} />
			</RightClickMenuWrapper>
		</div>
	);
};
export default GenericAssignCell;
