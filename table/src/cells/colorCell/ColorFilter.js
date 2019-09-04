import React from 'react'
import { GenericDropdown } from '@execview/reusable'
import ColorCellClasses from './ColorCell.module.css'
import ColorFilterClasses from './ColorFilter.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckSquare, faSquare } from '@fortawesome/free-solid-svg-icons';
const classes = {...ColorCellClasses, ...ColorFilterClasses}

const ColorFilter = (props) => {
	const activeFilters = props.activeFilter || {} // {removeRed: ()=>removesRedFromData}

	const colors = props.colorStrings || { green: 'green', amber: 'amber', red: 'red', grey: 'grey', blue: 'blue'}
	const options = Object.fromEntries(Object.entries(colors).map(([c,s])=>{
		const checked = Object.keys(activeFilters).includes(c)
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
		const toggledOn = !Object.keys(activeFilters).includes(f)
		let updatedFilters = activeFilters
		if(toggledOn){
			updatedFilters[f] = ((allData)=>{
				return Object.fromEntries(Object.entries(allData).filter(([rowkey,row])=>{
					const colorColumn = props.filterProperties[0]
					const color = row[colorColumn]
					return color!==f && !(f==='grey' && !color)
				}))
			})
		} else {
			const {[f]:_,...newFilters} = activeFilters
			updatedFilters = newFilters
		}
		console.log(updatedFilters)
		props.onValidateSave && props.onValidateSave(updatedFilters);
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