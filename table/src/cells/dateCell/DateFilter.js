import React from 'react'
import InPlaceCell from '../InPlaceCell/InPlaceCell'
import classes from './DateFilter.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import DateCell from './DateCell'

const DateFilter = (props) => {
	const activeFilters = props.activeFilter || {} // {removeRed: ()=>removesRedFromData}

	const beforeFilter = activeFilters.beforeFilter
	const afterFilter = activeFilters.afterFilter

	const options = {
		before: {
			text: 'Before',
			date: beforeFilter && beforeFilter.meta,
			filter: 'beforeFilter'
		},
		after: {
			text: 'After',
			date: afterFilter && afterFilter.meta,
			filter: 'afterFilter'
		},
	}

	const setFilter = (f,date) => {
		let updatedFilters = activeFilters
		updatedFilters[options[f].filter] = {
			meta: date,
			filter: ((allData)=>{
				return Object.fromEntries(Object.entries(allData).filter(([rowkey,row])=>{
					const dateColumn = props.filterProperties[0]
					const dataDate = row[dateColumn]
					if(!dataDate){return true}
					if(f==='before') {
						return dataDate < date
					} else {
						return dataDate > date
					}
					
				}))
			})
		}
		props.onValidateSave && props.onValidateSave(updatedFilters);
	}

	const removeFilter = (f) => {
		const {[options[f].filter]:_,...updatedFilters} = activeFilters
		props.onValidateSave && props.onValidateSave(updatedFilters);
	}

	return (
		<div className={`${classes['container']} ${props.className||''}`}>
			<div>Filter:</div>
			<div className={classes['date-filter']}>
				{Object.entries(options).map(([o,op])=>{
					return (
						<div className={classes['filter-option']}>
							<div>{op.text}:</div> 
							<InPlaceCell data={op.date} type={<DateCell dateUnknown='Any' onValidateSave={(d)=>setFilter(o,d)}/>}/>
							{op.date ? <FontAwesomeIcon icon={faWindowClose} style={{color: 'red'}} onClick={()=>removeFilter(o)}/> : null}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default DateFilter

/* 

updatedFilters[f] = ((allData)=>{
	return Object.fromEntries(Object.entries(allData).filter(([rowkey,row])=>{
		const colorColumn = props.filterProperties[0]
		const color = row[colorColumn]
		return color!==f && !(f==='grey' && !color)
	}))
})

 */