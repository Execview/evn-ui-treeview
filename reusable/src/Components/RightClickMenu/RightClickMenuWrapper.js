import React, { useState, useEffect } from 'react';
import RightClickMenu from './RightClickMenu';
import useFunctionalRef from '../../Functions/useFunctionalRef';

const RightClickMenuWrapper = (props) => {
	const [wrapperRef, current] = useFunctionalRef();
	const parentNode = current && current.parentNode;
	const [rightClickPosition, setRightClickPosition] = useState(null);
	const [parentPosition, setParentPosition] = useState(null);
	

	const openMenu = (e) => {
		if (props.stopPropagation) { e.stopPropagation(); }

		if (props.takeParentLocation) {
			const PR = parentNode.getBoundingClientRect();
			const documentRect = document.documentElement.getBoundingClientRect();
			console.log(PR)
			const newParentPosition = {
				x: PR.left - documentRect.left,
				y: PR.top - documentRect.top,
				screenX: PR.left,
				screenY: PR.top,
				width: PR.width,
				height: PR.height
			};
			setParentPosition(newParentPosition);
		} else {
			const newMousePosition = {
				x: e.pageX,
				y: e.pageY,
				screenX: e.clientX,
				screenY: e.clientY
			};
			
			setRightClickPosition(newMousePosition);
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
	});
	return (
        <div ref={wrapperRef}>
			{(rightClickPosition || parentPosition) && (
				<RightClickMenu inline={props.inline} mousePosition={rightClickPosition} parentPosition={parentPosition} closeMenu={()=>{setRightClickPosition(null);setParentPosition(null)}} enableModal={props.enableModal} forceModal={props.forceModal}  rightClickMenuClassName={props.rightClickMenuClassName} modalClassName={props.modalClassName}>
					{props.children}
				</RightClickMenu>
			)}
        </div>
	);
};

export default RightClickMenuWrapper;