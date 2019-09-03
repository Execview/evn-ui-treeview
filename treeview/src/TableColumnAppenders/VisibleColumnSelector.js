import React, { useState, useEffect } from 'react'

const VisibleColumnSelector = (props) => {
	const filterList = props.filteredColumns
	const columnsInfo = props.columnsInfo || {}
	const [visibleColumns, setVisibleColumns] = useState(Object.keys(columnsInfo).filter(c=>!filterList.includes(c)))
	

	useEffect(()=>{
		if(!columnsInfo){return}
		const vs = Object.keys(columnsInfo).filter(c=>!filterList.includes(c))
		setVisibleColumns(vs)
	},[columnsInfo,filterList])


	const getNewColumnsInfo = (cols,vs) => {
		// const getNewHeaderType = (v) => {
		// 	const header = columnsInfo[v].headerType
		// 	console.log(header)
		// 	if(typeof(header)==='string'){
		// 		return header
		// 	} else {
		// 		return <EnhancedHeader display={header}/>
		// 	}
		// }

		const newCols = vs.reduce((t,v)=>{
			const col = cols[v]
			const newCol = col //.headerType ? {...col,headerType: getNewHeaderType(v)} : col
			return {...t, [v]: newCol}
		},{})
		return newCols
	}

	const {filteredColumns, ...newProps} = props
	return (
		React.cloneElement(newProps.children,
		{...newProps,
		children: newProps.children && newProps.children.props.children,
		columnsInfo: getNewColumnsInfo(columnsInfo,visibleColumns)})
	);
}

export default VisibleColumnSelector