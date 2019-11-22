import React from 'react'

const EmptyHandler = (props) => {
	return (
		<div className={`${props.draggableHandle} ${props.className}`}>{props.children}</div>
	)
}

export default EmptyHandler