import { useState, useEffect } from 'react'

const useVisibleColumns = (columnsInfo={},filterList=[],active=true) => {
	const getVisibleColumnsKeys = (ci, fl) => Object.keys(ci).filter(c=>!fl.includes(c))

	const [visibleColumns, setVisibleColumns] = useState(getVisibleColumnsKeys(columnsInfo, filterList))
	
	useEffect(()=>{
		if(!columnsInfo){return}
		const vs = getVisibleColumnsKeys(columnsInfo, filterList)
		setVisibleColumns(vs)
	},[JSON.stringify(Object.keys(columnsInfo)),JSON.stringify(Object.keys(filterList))])


	const getNewColumnsInfo = (cols,vs) => {
		const newCols = vs.reduce((t,v)=>{
			return {...t, [v]: cols[v]}
		},{})
		return newCols
	}

	if(!active){return columnsInfo}
	return getNewColumnsInfo(columnsInfo,visibleColumns)
}

export default useVisibleColumns