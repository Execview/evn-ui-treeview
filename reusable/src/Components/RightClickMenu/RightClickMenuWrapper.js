import React, { useState, useEffect } from 'react';
import RightClickMenu from './RightClickMenu';
import useFunctionalRef from '../../Functions/useFunctionalRef';

const RightClickMenuWrapper = (props) => { //TODO MAKE TAKEPARENTLOCATION TRUE IF POSITION IS EMPTY BUT OPEN IS TRUE. MAKE IT CALCULATE THE PARENT LOCATION TOO...
	const [wrapperRef, current] = useFunctionalRef();
	const parentNode = current && current.parentNode;

	const [open, setOpen] = props.setOpen ? [props.open,props.setOpen] : useState(false)
	const [position, setPosition] = useState(null);

	const openMenu = (e) => {
		if (props.stopPropagation) { e.stopPropagation(); }

		if (props.takeParentLocation) {
			const PR = parentNode.getBoundingClientRect();
			const newParentPosition = {
				x: PR.left + window.pageXOffset,
				y: PR.top + window.scrollY,
				screenX: PR.left,
				screenY: PR.top,
				width: PR.width,
				height: PR.height
			};
			setPosition(newParentPosition);
			setOpen(true)
		} else {
			const newMousePosition = {
				x: e.pageX,
				y: e.pageY,
				screenX: e.clientX,
				screenY: e.clientY,
				width: 0,
				height: 0
			};
			
			setPosition(newMousePosition);
			setOpen(true)
		}
	};

	const onLeftClick = (e) => { if (props.onLeftClick) { openMenu(e); } };
	const onContextMenu = (e) => { if (!props.onLeftClick) { e.preventDefault(); openMenu(e); } };

	useEffect(() => {
		if (!parentNode) { return; }
		parentNode.addEventListener('click', onLeftClick);
		parentNode.addEventListener('contextmenu', onContextMenu);
		return (() => {
			parentNode.removeEventListener('click',onLeftClick)
			parentNode.removeEventListener('contextmenu',onContextMenu)
		})
	},[parentNode]);

	return (
        <div ref={wrapperRef}>
			{position && open && (
				<RightClickMenu inline={props.inline} position={position} takeParentLocation={props.takeParentLocation} closeMenu={()=>setOpen(false)} enableModal={props.enableModal} forceModal={props.forceModal} rightClickMenuClassName={props.rightClickMenuClassName} modalClassName={props.modalClassName}>
					{props.children}
				</RightClickMenu>
			)}
        </div>
	);
};

export default RightClickMenuWrapper;
