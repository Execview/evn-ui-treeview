import React, { useState } from 'react';
import { injectObjectInObject } from '@execview/reusable';
import DraggableTreeCell from '../treeCell/DraggableTreeCell.js';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend'

const wrapper = (props) => <DndProvider backend={HTML5Backend}>{props.children}</DndProvider>

const useTree = (data={},columnsInfo={},options={},active=true) => {
	const [tree,setTree] = useState({});
	if(!active){return [data, columnsInfo]}
	const roots = options.roots
	const setSelectedRow = options.setSelectedRow
	const selectedRow = options.selectedRow
	const hideText = options.hideText 
	const treeOptions = options.treeOptions
	const columnName = options.columnName || 'treeExpander'
	const tryPerformAssociation = options.tryPerformAssociation
	
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
					...select,
					onDrop: dragId => tryPerformAssociation && tryPerformAssociation(rowId, dragId) 
				}
			}
		}
		return newTableData
	}

	const addTreeColumn = ()=>{
		let {position, ...otherTreeOptions} = treeOptions || {}
		position = position || 'start';
		const newColumn = {[columnName]: {...columnsInfo[columnName], cellType: <DraggableTreeCell />, headerType: 'Tree', minWidth: hideText ? '15' : undefined, ...otherTreeOptions}}

		return injectObjectInObject(columnsInfo, newColumn, position);
	}

	return [addTreeData(), addTreeColumn(), wrapper || (p=>p.children)]
}

export default useTree;

export const getRootsFromData = (data) => {
	return Object.keys(data).filter(key=>!data[key].ParentAssociatedBubble)
}
