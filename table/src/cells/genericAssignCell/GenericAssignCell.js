import React from 'react';
import classes from './GenericAssignCell.module.css';
import { RightClickMenuWrapper } from '@execview/reusable';
import GenericAssign from './GenericAssign';

const GenericAssignCell = (props) => {
	const permission = props.permission
	const isEditable = permission > 1;
	const allItems = props.items;
	const data = props.data || [];

	return (
		<div className={classes["generic-cell"]}>
			{React.createElement(props.display.type, { ...props.display.props, permission: permission, allItems, items: data, style: props.style })}
			<RightClickMenuWrapper onLeftClick takeParentLocation moveBox={[40,0]} rightClickMenuClassName={`${classes['rcm']} ${isEditable ? '' : classes['rcm-small']}`} {...props.rightClickMenuWrapperProps}>
				<GenericAssign
					allItems={props.items}
					items={props.data}
					getOption={props.getOption}
					permission={permission}
					getSearchField={props.getSearchField} 
					style={props.style}
					onValidateSave={props.onValidateSave} 
					leftTitle={props.leftTitle}
					rightTitle={props.rightTitle} 
				/>
			</RightClickMenuWrapper>
		</div>
	);
};
export default GenericAssignCell;
