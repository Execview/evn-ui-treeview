import React, { useState } from 'react';
import TreeCell from '../treeCell/TreeCell';
import { injectObjectInObject } from '@execview/reusable';

const TreeAppender = (props) => {
	const [tree,setTree] = useState(Object.keys(props.data).reduce((t, key) =>({...t,[key]:false}),{}));

	const getDisplayedTreeStructure = (parentNodes)=>{
		//an array of arrays of the rows to display, their corresponding depths, and whether they are open/closed/neither.
		var newDisplayedRows = []
		const pushChildRows = (childnodes,currentdepth=0) => {
			for(const currentRow of childnodes){
			let arrowstatus = tree[currentRow] ? 'open': 'closed';
			if(props.data[currentRow].ChildAssociatedBubbles.length===0){arrowstatus='none'}
			newDisplayedRows.push({	
				key:currentRow,
				depth:currentdepth,
				nodeStatus: arrowstatus
			})
			if(tree[currentRow]){
				pushChildRows(props.data[currentRow].ChildAssociatedBubbles,currentdepth+1)
			}
		}}
		pushChildRows(parentNodes)
		return newDisplayedRows
	}

	const getParentNodes = (data) => {
		return Object.keys(data).filter(key=>data[key].ParentAssociatedBubble==='')
	}


	const addTreeData = () => {
		//inject TreeExpander dataBubble data.
		const displayedRows = getDisplayedTreeStructure(getParentNodes(props.data))
		let newTableData = {}
		for(let i=0; i<displayedRows.length; i++){
			const rowId = displayedRows[i].key
			const select = props.setSelected ? {isSelected: rowId === props.selectedRow,setSelected: (() => props.setSelected(rowId))} : {}
			newTableData[rowId] = {
				...props.data[rowId],
				treeExpander:{
					...displayedRows[i],
					text: props.data[rowId].activityTitle,
					toggleNode: (()=> setTree({...tree,[rowId]:!tree[rowId]})),
					...select
				}
			}
		}
		return newTableData
	}

	const addTreeColumn = ()=>{
		const newColumn = {treeExpander: {cellType: 'tree', height: (props.height || 0), headerData: 'Tree', width:10}}
		const position = props.treePosition || 'start';
		return injectObjectInObject(props.columnsInfo, newColumn, position);
	}

	const columnsInfo = addTreeColumn()
	const tableData = addTreeData()
	const {onToggleNode, setSelected, ...newProps} = props
	return (
		React.cloneElement(newProps.children,
		{...newProps,
		children: newProps.children && newProps.children.props.children,
		cellTypes: {...newProps.cellTypes, tree: { display: <TreeCell /> }},
		data: tableData,
		columnsInfo: columnsInfo})
	);
}

export default TreeAppender;
