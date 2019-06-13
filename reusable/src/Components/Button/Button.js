import React from 'react';
import './Button.css'


const Button = (props) => {
	const {className,children,...otherProps} = props
    return (
		<button className={'default-button '+ (className || 'default-interactions')} type="button" {...otherProps}>{props.children}</button>
	);
}

export default Button;