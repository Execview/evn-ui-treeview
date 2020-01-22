import React, { useState } from 'react';
import TreeCell from '../treeCell/TreeCell';
import { injectObjectInObject } from '@execview/reusable';

const TreeAppender = (props) => {
	const [tree,setTree] = useState(Object.keys(props.data).reduce((t, key) =>({...t,[key]:false}),{}));

	const getDisplayedTreeStructure = (parentNodes)=>{
		//an array of arrays of the rows to display, their corresponding depths, and whether they are open/closed/neither.
		var newDisplayedRows = []
		const pushChildRows = (childnodes,currentdepth=0) => {
			for(const childId of childnodes){
				const currentRow = props.data[childId]
				let arrowstatus = tree[childId] ? 'open': 'closed';
				const currentRowChildren = ((currentRow && currentRow.ChildAssociatedBubbles) || [])
				if(currentRowChildren.length===0 || !currentRowChildren.some(child=>props.data[child])){arrowstatus='none'}
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

	const getParentNodes = (data) => {
		return Object.keys(data).filter(key=>!data[key].ParentAssociatedBubble)
	}


	const addTreeData = () => {
		//inject TreeExpander dataBubble data.
		const displayedRows = getDisplayedTreeStructure(props.roots || getParentNodes(props.data))
		let newTableData = {}
		for(let i=0; i<displayedRows.length; i++){
			const rowId = displayedRows[i].key
			const rowData = props.data[rowId]
			if(!rowData){continue}
			const select = props.setSelected ? {isSelected: rowId === props.selectedRow,setSelected: (() => props.setSelected(rowId))} : {}
			newTableData[rowId] = {
				...rowData,
				treeExpander:{
					...displayedRows[i],
					text: rowData.name,
					toggleNode: (()=> setTree({...tree,[rowId]:!tree[rowId]})),
					...select
				}
			}
		}
		return newTableData
	}

	const addTreeColumn = ()=>{
		let {position, ...otherTreeOptions} = props.treeOptions || {}
		position = position || 'start';
		const newColumn = {treeExpander: {cellType: 'tree', height: (props.height || 0), headerData: 'Tree', ...otherTreeOptions}}

		return injectObjectInObject(props.columnsInfo, newColumn, position);
	}

	const columnsInfo = addTreeColumn()
	const tableData = addTreeData()
	const {onToggleNode, setSelected, ...newProps} = props
	return (
		React.cloneElement(newProps.children,
		{...newProps,
		children: newProps.children && newProps.children.props.children,
		cellTypes: {...newProps.cellTypes, tree: <TreeCell /> },
		data: tableData,
		columnsInfo: columnsInfo})
	);
}

export default TreeAppender;
