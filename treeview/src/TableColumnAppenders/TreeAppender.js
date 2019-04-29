import React, { Component } from 'react';
import TreeCell from '../treeCell/TreeCell';

export default class TreeAppender extends Component {
	constructor(props){
		super(props)
		this.state = { rowHeights: []}
	}
	
	getDisplayedTreeStructure = (tree, parentNodes)=>{
		//an array of arrays of the rows to display, their corresponding depths, and whether they are open/closed/neither.
		var newDisplayedRows = []
		const pushChildRows = (childnodes,currentdepth=0) => {
			for(let i=0;i<childnodes.length;i++){
			let currentRow = childnodes[i]
			let arrowstatus = tree[currentRow].open ? 'open': 'closed';
			if(tree[currentRow].ChildAssociatedBubbles.length===0){arrowstatus='none'}
			newDisplayedRows.push({	key:currentRow,
									depth:currentdepth,
									nodeStatus: arrowstatus
								})
			if(tree[currentRow].open){
				pushChildRows(tree[currentRow].ChildAssociatedBubbles,currentdepth+1)
			}
		}}
		pushChildRows(parentNodes)
		return newDisplayedRows
	}

	getParentNodes = (data) => {
		return Object.keys(data).filter(key=>data[key].ParentAssociatedBubble==='')
	}


	addTreeData = ()=>{
		//inject TreeExpander dataBubble data.
		const displayedRows = this.getDisplayedTreeStructure(this.props.data, this.getParentNodes(this.props.data))
		let newTableData = {}
		for(let i=0; i<displayedRows.length; i++){
			const rowId = displayedRows[i].key
			newTableData[rowId] = {...this.props.data[rowId],
									treeExpander:{
										...displayedRows[i],
										text: this.props.data[rowId].activityTitle,
										toggleNode: (()=>this.props.onToggleNode(rowId))
									}
								}
		}
		return newTableData
	}

	addTreeColumn = ()=>{
		return {treeExpander: {cellType: 'tree', headerData: 'Tree'}, ...this.props.columnsInfo}
	}

  	render() {//TODO: Remove extra props before spreading!
		const columnsInfo = this.addTreeColumn()
		const tableData = this.addTreeData()
		const {onToggleNode, ...newProps} = this.props
    	return (
			React.cloneElement(newProps.children,
			{...newProps,
			children: newProps.children && newProps.children.props.children,
			cellTypes: {...newProps.cellTypes, tree: { display: <TreeCell /> }},
			data: tableData,
			columnsInfo: columnsInfo})
		);
  	}

}
