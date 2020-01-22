import React from 'react'
import { GenericDropdown } from '@execview/reusable'
import ColorCellClasses from './ColorCell.module.css'
import ColorFilterClasses from './ColorFilter.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
const classes = {...ColorCellClasses, ...ColorFilterClasses}

const ColorFilter = (props) => {
	const [meta, setMeta] = [props.meta || [], props.setMeta || (()=>console.log('no setMeta'))] //[red, green]

	const colors = props.colorStrings || { green: 'green', amber: 'amber', red: 'red', grey: 'grey', blue: 'blue'}
	const options = Object.fromEntries(Object.entries(colors).map(([c,s])=>{
		const checked = !meta.includes(c)
		const optionComponent = (
			<div className={classes['color-option']}>
				<div style={{display:'flex', alignItems: 'center'}}>
					<FontAwesomeIcon icon={checked ? faCheckSquare: faSquare} style={{padding: '5px'}}/>
					<div className={classes['color-circle-container']}><div className={`${classes['color-circle']} ${classes['solid-background-'+c]}`}/></div>
				</div>
				<div>{s}</div>
			</div>
		)
		return [c,optionComponent]
	}))

	const submitToggledFilter = (f) => {
		const toggledOn = !meta.includes(f)
		let newMeta = null
		if(toggledOn){
			newMeta = [...meta, f]
		} else {
			newMeta = meta.filter(colour=>colour!==f)
		}
		setMeta(newMeta);
	}

	return (
		<div className={`${classes['container']} ${props.className||''}`}>
			<div>Filter:</div>
			<div className={classes['color-filter']}>
				<GenericDropdown
					submit={(key) => { submitToggledFilter(key) }}
					options={options}
					genericDropdownClasses={{dropdown: classes["no-padding"]}}
				/>
			</div>
		</div>
	)
}

export default ColorFilter

export const filter = (data, column, meta=[]) => {
	return Object.fromEntries(Object.entries(data).filter(([rowkey,row])=>{
		const color = row[column]
		return !meta.includes(color) && !(color==='grey' && !color)
	}))
}