import React, { Component } from 'react';
import {treeStructure, data, columnsInfo, cellTypes, editableCells} from './config'
import Table from './TEMP-TABLE/table/Table'

class TreeView extends Component {
	constructor(props){
		super(props)
		const initialTree = Object.keys(treeStructure).reduce((total, nodeKey)=>{return {...total,[nodeKey]:{...treeStructure[nodeKey], open: false}}},{})
		this.state = {tree: initialTree, parentNodes: ["_1235d","_m7ad1"]}
		console.log(initialTree)
	}
	
	//display rows that have no parents. ASSUME THIS LIST EXISTS FOR NOW. cycle through those and add child rows.
	getDisplayedRows(){
		//an array of arrays of the rows to display, and their corresponding depths.
		var newDisplayedRows = []

		const pushChildRows = (childnodes,currentdepth=0) => {
			for(let i=0;i<childnodes.length;i++){
			let currentRow = childnodes[i]
			let arrowstatus = this.state.tree[currentRow].open ? 'open': 'closed';
			if(this.state.tree[currentRow].nodes.length===0){arrowstatus='none'}
			newDisplayedRows.push({key:currentRow, depth:currentdepth, nodeStatus: arrowstatus})
			if(this.state.tree[currentRow].open){
				pushChildRows(this.state.tree[currentRow].nodes,currentdepth+1)
			}
		}}

		pushChildRows(this.state.parentNodes)
		return newDisplayedRows
	}

	getTableData(){
		//inject TreeExpander data
		const displayedRows = this.getDisplayedRows()
		let tableData = {}
		for(let i=0; i<displayedRows.length; i++){
			const rowId = displayedRows[i].key
			tableData[rowId] = {...data[rowId],
									treeExpander:{
										...displayedRows[i],
										text: data[rowId].activityTitle,
										toggleNode: (()=>this.toggleNode(rowId))
									}
								}
		}
		return tableData
	}

	toggleNode = (nodeKey) =>{
		this.setState({tree: 
						{...this.state.tree,
							[nodeKey]:{...this.state.tree[nodeKey],
								open: !this.state.tree[nodeKey].open
							}
						}
					})
	}

  	render() {
		const tableData = this.getTableData()
    	return (
			<div className="table-container">
				<Table 
					columnsInfo={columnsInfo}
					editableCells={editableCells}
					cellTypes={cellTypes}
					data={tableData}
					tableWidth={1800}
					dontPreserveOrder={true}
					wrap={true}
										
				/>
			</div>
		);
  	}
}

export default TreeView;


/*<table>
	<tbody>
	{this.getDisplayedRows().map(displayRow => {console.log(data[displayRow.key]); return <TreeRow key={displayRow.key} rowData={data[displayRow.key]} depth={displayRow.depth} nodeStatus={displayRow.nodeStatus} toggleNode={()=>this.toggleNode(displayRow.key)}/>})}
	</tbody>
</table>*/