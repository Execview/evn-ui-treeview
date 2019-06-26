import React, { useState } from 'react';
import './GenericAssignDisplay.css';
import AssignGeneric from './AssignGeneric';
// import ImageDisplay from '../imageDisplay/ImageDisplay';


const GenericAssignDisplay = (props) => {
	const [open, setOpen] = useState(false);
	const allItems = props.items;
	const data = props.data || [];

	return (
		<div className="generic-cell" onClick={() => setOpen(true)}>
			{React.createElement(props.display.type, { ...props.display.props, allItems, items: data, style: props.style })}
			{open && (
				<AssignGeneric
					allItems={allItems}
					items={data}
					page1={props.page1}
					page2={props.page2}
					page3={props.page3}
					page4={props.page4}
					closeMenu={() => setOpen(false)}
					onValidateSave={props.onValidateSave}
				/>
			)}
		</div>
	);
};
export default GenericAssignDisplay;
