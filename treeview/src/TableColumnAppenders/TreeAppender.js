import React, { Component } from 'react';
import TreeCell from '../treeCell/TreeCell';
import { recursiveDeepDiffs } from '@execview/reusable';

export default class TreeAppender extends Component {
	constructor(props){
		super(props)
		this.state = { rowHeights: []}
	}

	shouldComponentUpdate(nextProps) {
      const filterReactComponent = (c) => {
        const { _owner, $$typeof, ...rest } = c;
        return rest;
      };
      const stopRecursion = (o, u) => {
        if (React.isValidElement(o) && React.isValidElement(u)) {
          if (recursiveDeepDiffs(filterReactComponent(o), filterReactComponent(u), { stopRecursion })) {
            return 'updated';
          }
          return 'ignore';
        }
        return 'continue';
      };
      const diffs = recursiveDeepDiffs(this.props, nextProps, { stopRecursion });
      return diffs;
    }

	getDisplayedTreeStructure = (tree, parentNodes)=>{
		//an array of arrays of the rows to display, their corresponding depths, and whether they are open/closed/neither.
		var newDisplayedRows = []
		const pushChildRows = (childnodes,currentdepth=0) => {
			for(const currentRow of childnodes){
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
			const select = this.props.setSelected ? 
				{isSelected: rowId === this.props.selectedRow, setSelected: (() => this.props.setSelected(rowId))} : {}
			newTableData[rowId] = {...this.props.data[rowId],
									treeExpander:{
										...displayedRows[i],
										text: this.props.data[rowId].activityTitle,
										toggleNode: (()=>this.props.onToggleNode(rowId)),
										...select
									}
								}
		}
		return newTableData
	}

	addTreeColumn = ()=>{
		return {treeExpander: {cellType: 'tree', height: (this.props.height || 0), headerData: 'Tree', width:10}, ...this.props.columnsInfo}
	}

  	render() {//TODO: Remove extra props before spreading!
		const columnsInfo = this.addTreeColumn()
		const tableData = this.addTreeData()
		const {onToggleNode, setSelected, ...newProps} = this.props
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
