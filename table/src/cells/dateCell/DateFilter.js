import React from 'react'
import InPlaceCell from '../InPlaceCell/InPlaceCell'
import classes from './DateFilter.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import DateCell from './DateCell'

const DateFilter = (props) => {
	const [meta, setMeta] = [props.meta || {}, props.setMeta || (()=>console.log('no setMeta'))] // {before: date, after: date}

	const text = props.text || {}

	const options = {
		before: {
			text: text.before || 'Before',
			date: meta.before
		},
		after: {
			text: text.after || 'After',
			date: meta.after
		},
	}

	const removeFilter = (f) => {
		const {[f]:_,...newMeta} = meta
		setMeta(newMeta);
	}

	return (
		<div className={`${classes['container']} ${props.className||''}`}>
			<div>Filter:</div>
			<div className={classes['date-filter']}>
				{Object.entries(options).map(([o,op])=>{
					return (
						<div className={classes['filter-option']} key={o}>
							<div>{op.text}:</div> 
							<InPlaceCell data={op.date} type={<DateCell rightClickMenuWrapperProps={{dontPortal: true}} dateUnknown='Any'/>} onValidateSave={(d)=>setMeta({...meta,[o]:d})}/>
							{op.date ? <FontAwesomeIcon icon={faWindowClose} className={classes['remove-filter']} onClick={()=>removeFilter(o)}/> : null}
						</div>
					)
				})}
			</div>
		</div>
	)
}

export default DateFilter

export const filter = (data, column, meta={}) => {
	return Object.fromEntries(Object.entries(data).filter(([rowkey,row])=>{
		const dataDate = row[column]
		if(!dataDate){return true}
		let keepRow = true
		if(meta.before){
			const date = new Date(meta.before)
			keepRow = keepRow && dataDate < date
		}
		if(meta.after){
			const date = new Date(meta.after)
			keepRow = keepRow && dataDate > date
		}
		return keepRow	
	}))
}