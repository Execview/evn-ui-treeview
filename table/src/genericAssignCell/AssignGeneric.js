import React, { useState } from 'react';
import { OCO } from '@execview/reusable';
import './GenericAssignDisplay.css';


const AssignGeneric = (props) => {
	const p = {
		one: 'Page1',
		two: 'Page2',
		three: 'Page3',
		four: 'Page4'
	};

	const [visiblePanel, setVisiblePanel] = useState(p.one);
	const [selectedItems, setSelectedItems] = useState([]);
	const [assignExtraTo, setAssignExtraTo] = useState('');


	const handleClickOutside = () => {
		props.closeMenu();
	};

	const nextScreen = () => {
		let newPage = '';
		switch (visiblePanel) {
			case p.one:
				newPage = p.two;
				break;
			case p.two:
				newPage = p.three;
				break;
			case p.three:
				newPage = p.four;
				break;
			case p.four:
				newPage = p.three;
				break;
			default:
				break;
		}
		setVisiblePanel(newPage);
	};

	const unassignGeneric = (itemId) => {
		props.onValidateSave(props.items.filter(el => el !== itemId));
	};

	const assignGenerics = (newItems) => {
		props.onValidateSave([...props.items, ...newItems]);
		setSelectedItems(newItems);
		nextScreen();
	};

	const submitExtra = (generic, extra) => {
		const assignedGenerics = [];
		const currentGeneric = assignedGenerics.filter(assigned => assigned.generic === generic)[0];
		const newGenerics = [...assignedGenerics.filter(assigned => assigned.generic !== generic), { ...currentGeneric, generic, extra }];
    console.log(newGenerics)
		//props.onValidateSave(newGenerics); //THIS DOESNT WORK
		setSelectedItems(selectedItems.filter(el => el !== generic));
		nextScreen();
	};

	const editExistingExtra = (generic) => {
		setAssignExtraTo(generic);
		setVisiblePanel(p.four);
	};

	let panel;
	switch (visiblePanel) {
		case p.one: {
			panel = React.createElement(props.page1.type, { ...props.page1.props, nextScreen, items: props.items, allItems: props.allItems, addExtraTo: editExistingExtra });
			break;
		}
		case p.two: {
			panel = React.createElement(props.page2.type, { ...props.page2.props, items: props.items, allItems: props.allItems, submit: assignGenerics });
			break;
		}
		case p.three: {
			panel = React.createElement(props.page3.type, { ...props.page3.props, selectedItems, allItems: props.allItems, addExtraTo: editExistingExtra });
			break;
		}
		case p.four: {
			panel = React.createElement(props.page4.type, { ...props.page4.props, id: assignExtraTo, allItems: props.allItems, submit: submitExtra });
			break;
		}
		default: { break; }
	}

	return (
		<OCO OCO={handleClickOutside}>
			<div className="generic-menu">
				<div className="absolute-caret" />
				{panel}
			</div>
		</OCO>
	);
};

export default AssignGeneric;




            // <GenericMenu
            //   type={props.type}
            //   assignedGenerics={assignedGenerics}
            //   getGenericProfile={props.getGenericProfile}
            //   editExistingExtra={editExistingExtra}
            //   unassignGeneric={unassignGeneric}
            //   nextScreen={nextScreen}
            // />

            // <AddGenericDropdown
            //   nonAssignedGenerics={props.getAllGenericProfileKeys().filter(key => !(assignedGenerics.map(el => el.generic)).includes(key))}
            //   submitGenerics={assignGenerics}
            //   getGenericProfile={props.getGenericProfile}
            // />



              // <GenericAddedConfirmation
            //   type={props.type}
            //   assignedGenerics={items}
            //   getGenericProfile={props.getGenericProfile}
            //   addExtraTo={(generic) => { setAssignExtraTo(generic); nextScreen(); }}
            // />

            // <AddExtra
            //   submitExtra={submitExtra}
            //   addExtraTo={assignExtraTo}
						// />
