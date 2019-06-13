import React from 'react';
import './Button.css'


const Button = (props) => {
    return (
		<button className={'default-button '+ (props.className || 'default-button-colours')} style={props.style} type="button" onClick={props.onClick}>{props.children}</button>
	);
}

export default Button;