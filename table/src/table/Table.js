import React, { useState, useEffect } from 'react';
import Cell from '../cells/Cell/Cell';
import Resizer from './Resizer'

import classes from './Table.module.css'

const Table = (props) => {
	const MAX_FRS = 100 //sum of frs will always be this number after normalising
	const PIXELY_SCALE = window.innerWidth
	const DEFAULT_MINIMUM_WIDTH = '100px'

	const data = props.data
	const columnsInfo = props.columnsInfo
	const cellTypes = props.cellTypes

	const externalSetWidths = props.setWidths
	
	//#region const [widths, setWidths] = horribleStateThingWithNormalisation()
	const normaliseWidths = (widths,maxFrs=MAX_FRS) => { 
		const normalisationFactor = Object.values(widths).reduce((t,v)=>t+v,0)/maxFrs
		const normalisedWidths = Object.fromEntries(Object.entries(widths).map(([c,w])=>[c,w/normalisationFactor]))
		return normalisedWidths
	}
	const averageWidth = Object.values(columnsInfo).filter(v=>v.width).reduce((t,v,i)=>{if(i===0){return v.width || 0}return (t*i+v.width)/(i+1)},0) // calculates the average of the frs that exist
	const getWidthsFromColumnsInfo = (ci) => Object.fromEntries(Object.entries(ci).map(([k, col]) => {
		return [k, col.width || averageWidth]
	}))
	const currentWidths = getWidthsFromColumnsInfo(columnsInfo)
	const [selfWidths, setSelfWidths] = useState(currentWidths)
	useEffect(()=>{if(!externalSetWidths && JSON.stringify(currentWidths)!==JSON.stringify(widths)){setWidths(currentWidths)}},[columnsInfo])
	const [nonNormalWidths, setNonNormalWidths] = !externalSetWidths ? [selfWidths, setSelfWidths] : [currentWidths, externalSetWidths]
	const [widths, setWidths] = [normaliseWidths(nonNormalWidths), (newWidths)=>setNonNormalWidths(normaliseWidths({...widths, ...newWidths}))]
	//#endregion

	//#region resizeColumns logic
	const [resizerState, setResizerState] = useState()
	const resizeColumns = (e) => {
		if(!resizerState){return}
		const mouseDelta = e.clientX - resizerState.initialPosition
		const pixelyWidths = normaliseWidths(widths, PIXELY_SCALE)
		const changes = {
			[resizerState.leftColumnName]: Math.max(0,resizerState.leftColumnInitialWidth + mouseDelta),
			[resizerState.rightColumnName]: Math.max(0,resizerState.rightColumnInitialWidth - mouseDelta)
		} 
		setWidths(normaliseWidths({...pixelyWidths,...changes},MAX_FRS))
	}
	
	const addResizeListeners = (e, column) => {
		e.preventDefault();
		e.stopPropagation();
		const leftColumnName = Object.keys(widths)[Object.keys(widths).indexOf(column)-1]
		const pixelyWidths = normaliseWidths(widths, PIXELY_SCALE)
		setResizerState({
			initialPosition: e.clientX,
			leftColumnName: leftColumnName,
			leftColumnInitialWidth: pixelyWidths[leftColumnName],
			rightColumnName: column,
			rightColumnInitialWidth: pixelyWidths[column]
		});
		
	}
	const removeResizeListeners = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setResizerState(null)
	}
	
	useEffect(()=>{
		if(resizerState){
			document.addEventListener('pointermove', resizeColumns);
			document.addEventListener('pointerup', removeResizeListeners);
		}
		return ()=>{
			document.removeEventListener('pointermove', resizeColumns);
			document.removeEventListener('pointerup', removeResizeListeners);
		}
	},[resizerState])
	//#endregion


	let header = []
	let cells = []


	//header
	Object.keys(columnsInfo).forEach((col, i) => {
		const firstOne = i===0
		const column = columnsInfo[col];
		const headerType = typeof (column.headerType) === 'string' ? cellTypes[column.headerType] : column.headerType
		const headerData = column.headerData;
		header.push(
			<div key={col+i} style={{ position: 'relative', border: '1px solid red', gridColumnStart: col }}>
				{ !firstOne && <Resizer column={col} onPointerDownOnColumn={addResizeListeners}/> }
				<Cell data={headerData} type={headerType} isEditable={false} />
			</div>
		);
	})

	//cells
	Object.keys(data).forEach((row, i) => {
		const isEven = i % 2 === 0
		Object.keys(columnsInfo).forEach((col, j) => {
			const firstOne = j===0
			const column = columnsInfo[col]
			const type = typeof (column.cellType) === 'string' ? cellTypes[column.cellType] : column.cellType
			const cell = data[row][col] || {};
			cells.push(
				<div key={`cell${i}${j}`} style={{position: 'relative', border: '1px solid transparent', backgroundColor: isEven ? '#4f5564' : 'auto' }}>
					{ !firstOne && <Resizer column={col} onPointerDownOnColumn={addResizeListeners}/>}
					<Cell data={cell.data} type={type} isEditable={cell.isEditable} />
				</div>
			);
		})
	})

	const gridTemplateColumnsString = Object.entries(columnsInfo).reduce((t,[c,col]) => `${t} [${c}] minmax(${col.minWidth ? col.minWidth+'px' : DEFAULT_MINIMUM_WIDTH},${widths[c]+'fr'})`, ' ')

	//console.log(gridTemplateColumnsString)

	return (
		<div style={{ display: 'grid', gridTemplateColumns: gridTemplateColumnsString }}>
			{header}
			{cells}
		</div>
	)
}

// const getUniqueColumns = (data) => {
// 	let uniqueColumns = []
// 	for(const key in data){
// 		const row = data[key]
// 		for(const col in row){
// 			if(!uniqueColumns.includes(col)){
// 				uniqueColumns.push(col)
// 			}
// 		}
// 	}
// 	return uniqueColumns;
// };


export default Table