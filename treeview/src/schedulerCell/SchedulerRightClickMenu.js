import React, { useLayoutEffect, useRef } from 'react';
import { GenericDropdown } from '@execview/reusable'
import classes from './SchedulerRightClickMenu.module.css' 

const SchedulerRightClickMenu = (props) => {
	const contentRef = useRef(null)
	const onSubmit = () => {
		props.closeMenu();
	}

	useLayoutEffect(()=>{
		if(!contentRef || !contentRef.current || !props.menuHeight || !props.setMenuHeight){return}
		const contentHeight = contentRef.current.clientHeight
		if(props.menuHeight!==contentHeight){
			props.setMenuHeight(contentHeight)
		} 
	})

    return (
    	<foreignObject x={props.position[0]} y={props.position[1]} className={classes['foreign-object']}>
			<div ref={contentRef} className={classes["menu"]}>
				<GenericDropdown
					onBlur={props.closeMenu}
					submit={option => onSubmit(option)}
					options={props.options}
				/>		
				{/* <img alt="Whats this?" style={{width:'100%'}} src="https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg"/> */}
			</div>
		</foreignObject>
	);
}

export default SchedulerRightClickMenu;
