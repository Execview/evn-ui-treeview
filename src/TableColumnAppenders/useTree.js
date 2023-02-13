import React, { useState } from 'react';
import TreeCell from '../treeCell/TreeCell.js';
import { injectObjectInObject } from '@execview/reusable';

const useTree = (data={},columnsInfo={},options={},active=true) => {
	const [tree,setTree] = useState({});
	if(!active){return [data, columnsInfo]}
	const roots = options.roots
	const setSelectedRow = options.setSelectedRow
	const selectedRow = options.selectedRow
	const hideText = options.hideText 
	const treeOptions = options.treeOptions
	const columnName = options.columnName || 'treeExpander'
	
	const getDisplayedTreeStructure = (parentNodes)=>{
		//an array of arrays of the rows to display, their corresponding depths, and whether they are open/closed/neither.
		var newDisplayedRows = []
		const pushChildRows = (childnodes,currentdepth=0) => {
			for(const childId of childnodes){
				const currentRow = data[childId]
				let arrowstatus = tree[childId] ? 'open': 'closed';
				const currentRowChildren = ((currentRow && currentRow.ChildAssociatedBubbles) || [])
				if(currentRowChildren.length===0 || !currentRowChildren.some(child=>data[child])){arrowstatus='none'}
				newDisplayedRows.push({
					key:childId,
					depth:currentdepth,
					nodeStatus: arrowstatus
				})
				if(tree[childId]){
					pushChildRows(currentRowChildren,currentdepth+1)
				}
			}}
		
		pushChildRows(parentNodes)
		return newDisplayedRows
	}

	const addTreeData = () => {
		const displayedRows = getDisplayedTreeStructure(roots || getRootsFromData(data))
		let newTableData = {}
		for(let i=0; i<displayedRows.length; i++){
			const rowId = displayedRows[i].key
			const rowData = data[rowId]
			if(!rowData){continue}
			const select = setSelectedRow ? {isSelected: rowId === selectedRow,setSelectedRow: (() => setSelectedRow(rowId))} : {}
			newTableData[rowId] = {
				...rowData,
				[columnName]:{
					...displayedRows[i],
					text: hideText ? '' : rowData.name,
					toggleNode: (()=> setTree({...tree,[rowId]:!tree[rowId]})),
					...select
				}
			}
		}
		return newTableData
	}

	const addTreeColumn = ()=>{
		let {position, ...otherTreeOptions} = treeOptions || {}
		position = position || 'start';
		const newColumn = {[columnName]: {...columnsInfo[columnName], cellType: <TreeCell />, headerType: 'Tree', minWidth: hideText ? '15' : undefined, ...otherTreeOptions}}

		return injectObjectInObject(columnsInfo, newColumn, position);
	}

	return [addTreeData(), addTreeColumn()]
}

export default useTree;

export const getRootsFromData = (data) => {
	return Object.keys(data).filter(key=>!data[key].ParentAssociatedBubble)
}
