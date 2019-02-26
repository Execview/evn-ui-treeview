import React, { Component } from 'react';
import TreeRow from './TreeRow'
import {treeStructure, data} from './config'

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
    	return (
			<div className="table-container">
			<table>
				<tbody>
					{this.getDisplayedRows().map(displayRow => {console.log(data[displayRow.key]); return <TreeRow key={displayRow.key} rowData={data[displayRow.key]} depth={displayRow.depth} nodeStatus={displayRow.nodeStatus} toggleNode={()=>this.toggleNode(displayRow.key)}/>})}
				</tbody>
			</table>
			</div>
		);
  	}
}

export default TreeView;
