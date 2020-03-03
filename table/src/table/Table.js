import React, { useState, useEffect, useMemo } from 'react';
import Cell from '../cells/Cell/Cell';
import Resizer from './Resizer/Resizer'
import DefaultHeader from '../headers/DefaultHeader/DefaultHeader';
import classes from './Table.module.css'

const Table = (props) => {
	const MAX_FRS = 100 //sum of frs will always be this number after normalising
	const PIXELY_SCALE = window.innerWidth
	const DEFAULT_MINIMUM_WIDTH = '70px'

	const data = props.data
	const columnsInfo = props.columnsInfo
	const setColumnsInfo = props.setColumnsInfo
	
	//#region const [widths, setWidths] = horribleStateThingWithNormalisation()
	const normaliseWidths = (widths,maxFrs=MAX_FRS) => { 
		const normalisationFactor = Object.values(widths).reduce((t,v)=>t+v,0)/maxFrs
		const normalisedWidths = Object.fromEntries(Object.entries(widths).map(([c,w])=>[c,w/normalisationFactor]))
		return normalisedWidths
	}
	const averageWidth = Object.values(columnsInfo).filter(v=>v.width).reduce((t,v,i)=>{if(i===0){return v.width || 0}return (t*i+v.width)/(i+1)},0) || 1 // calculates the average of the frs that exist
	const getWidthsFromColumnsInfo = (ci) => Object.fromEntries(Object.entries(ci).map(([k, col]) => {
		return [k, (col.width || col.width===0) ? col.width : averageWidth]
	}))

	const externalSetWidths = (newWidths) => {
		const newColumnsInfo = Object.fromEntries(Object.entries(columnsInfo).map(([col,column])=>{
			const newColumn = {
				...column,
				width: newWidths[col]
			}
			return [col, newColumn]
		}))
		setColumnsInfo({
			...columnsInfo, ...newColumnsInfo
		})
	}
	
	const [widths, setWidths] = [normaliseWidths(getWidthsFromColumnsInfo(columnsInfo)), (newWidths)=>externalSetWidths(normaliseWidths({...widths, ...newWidths}))]
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
		const headerType = typeof (column.headerType) === 'string' ? <DefaultHeader data={column.headerType}/> : column.headerType
		header.push(
			<div key={col+i} className={`${classes['cell']} ${classes['header']}`} style={{ position: 'relative'}}>
				{props.getContextMenu && props.getContextMenu(col)}
				{ !firstOne && <Resizer column={col} onPointerDownOnColumn={addResizeListeners}/> }
				<Cell type={headerType}/>
			</div>
		);
	})

	//cells
	Object.keys(data).forEach((row, i) => {
		const isEven = i % 2 === 0
		const isRowSelected = row === props.selectedRow
		Object.keys(columnsInfo).forEach((col, j) => {
			const firstOne = j===0
			const column = columnsInfo[col]
			const type = column.cellType
			const cell = data[row][col] || {};
			const cellClassName = `${classes['cell']} ${isEven?classes['even-cell']:''} ${isRowSelected?classes['selected-row']:''}`
			cells.push(
				<div key={`cell${i}${j}`} className={cellClassName} style={{position: 'relative'}}>
					{ !firstOne && <Resizer column={col} onPointerDownOnColumn={addResizeListeners}/>}
					<Cell data={cell.data} type={type} permission={cell.permission} onValidateSave={(data)=>{props.onSave(row,col,data)}} errorText={cell.errorText}/>
				</div>
			);
		})
	})

	const gridTemplateColumnsString = Object.entries(columnsInfo).reduce((t,[c,col]) => `${t} [${c}] minmax(${col.minWidth ? col.minWidth+'px' : DEFAULT_MINIMUM_WIDTH},${widths[c]+'fr'})`, '')

	const gridTemplateRowsString = ''//Object.keys(data).reduce((t,k)=>`${t} [${k}] auto`,'')

	return (
		<div className={classes['horizontal-scroll']}>
			<div style={{ display: 'grid', gridTemplateColumns: gridTemplateColumnsString, gridTemplateRows: gridTemplateRowsString }} ref={props.tableRef}>
				{header}
				{cells}
			</div>
		</div>
	)
}

export default Table
