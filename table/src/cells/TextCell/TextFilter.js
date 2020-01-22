import React from 'react'
import InPlaceCell from '../InPlaceCell/InPlaceCell'
import classes from './TextFilter.module.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWindowClose } from '@fortawesome/free-solid-svg-icons'
import TextCell from './TextCell'

const TextFilter = (props) => {
	const [meta, setMeta] = [props.meta || '', props.setMeta || (()=>console.log('no setMeta'))] //'xd'

	const text = props.text || {}

	return (
		<div className={`${classes['container']} ${props.className||''}`}>
			<div>Filter:</div>
			<div className={classes['text-filter']}>
				<InPlaceCell data={meta} type={<TextCell onChange={(d)=>setMeta(d)} placeholder={text.placeholder || 'Search for text...'} autoFocus />}/>
				{meta ? <FontAwesomeIcon icon={faWindowClose} className={classes['remove-filter']} onClick={()=>setMeta('')}/> : null}
			</div>
		</div>
	)
}

export default TextFilter

export const filter = (allData, column, meta='') => {
	return Object.fromEntries(Object.entries(allData).filter(([rowkey,row])=>{
		const dataText = row[column] || ''
		return dataText.toLowerCase().includes(meta.toLowerCase())
		
	}))
}