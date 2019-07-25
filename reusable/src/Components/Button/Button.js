import React from 'react';
import './Button.css'


const Button = (props) => {
	const {className,children,...otherProps} = props
	const disabled = props.disabled ? ' disabled' : '';
    return (
		<button className={'default-button '+ (className || 'default-interactions') + disabled} type="button" {...otherProps}>{props.children}</button>
	);
}

export default Button;