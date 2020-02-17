import React from 'react'
import classes from './Resizer.module.css'

const Resizer = (props) => {
	return (
		<div onPointerDown={(e)=>props.onPointerDownOnColumn && props.onPointerDownOnColumn(e,props.column)} className={classes['col-resizer']}/>
	)
}

export default Resizer