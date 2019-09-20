import React from 'react'
import InPlaceCell from '../InPlaceCell/InPlaceCell'
import classes from './TextFilter.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import TextCell from './TextCell'

const TextFilter = (props) => {
	const activeFilters = props.activeFilter || {}
	const text = props.text || {}
	console.log(text)
	const includes = activeFilters['includes']
	const currentSearch = includes && includes.meta

	const setFilter = (search) => {
		if(!search){removeFilter(); return}
		let updatedFilters = activeFilters
		updatedFilters['includes'] = {
			meta: search,
			filter: ((allData)=>{
				return Object.fromEntries(Object.entries(allData).filter(([rowkey,row])=>{
					const textColumn = props.filterProperties[0]
					const dataText = row[textColumn] || ''
					return dataText.toLowerCase().includes(search.toLowerCase())
					
				}))
			})
		}
		props.onValidateSave && props.onValidateSave(updatedFilters);
	}

	const removeFilter = () => {
		const {['includes']:_,...updatedFilters} = activeFilters
		props.onValidateSave && props.onValidateSave(updatedFilters);
	}

	return (
		<div className={`${classes['container']} ${props.className||''}`}>
			<div>Filter:</div>
			<div className={classes['text-filter']}>
				<InPlaceCell data={currentSearch} type={<TextCell onChange={(d)=>setFilter(d)} placeholder={text.placeholder || 'Search for text...'} autoFocus />}/>
				{currentSearch ? <FontAwesomeIcon icon={faWindowClose} className={classes['remove-filter']} onClick={()=>removeFilter()}/> : null}

			</div>
		</div>
	)
}

export default TextFilter
