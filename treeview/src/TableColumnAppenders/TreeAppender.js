import React, { Component } from 'react';

export default class TreeAppender extends Component {
	constructor(props){
		super(props)
		this.state = { rowHeights: []}
	}

	addTreeData = ()=>{
		//inject TreeExpander dataBubble data.
		const displayedRows = this.props.displayedTreeStructure
		let tableData = {...this.props.data}
		for(let i=0; i<displayedRows.length; i++){
			const rowId = displayedRows[i].key
			tableData[rowId] = {...tableData[rowId],
									treeExpander:{
										...displayedRows[i],
										text: tableData[rowId].activityTitle,
										toggleNode: (()=>this.props.onToggleNode(rowId))
									}
								}
		}
		return tableData
	}

	addTreeColumn = ()=>{
		return {treeExpander: {cellType: 'tree', headerData: 'Tree'}, ...this.props.columnsInfo}
	}

  	render() {//TODO: Remove extra props before spreading!
		const columnsInfo = this.addTreeColumn()
		const tableData = this.addTreeData()
    	return (
			<div className="table-container">
				{React.cloneElement(this.props.children,
				{...this.props,
				children: this.props.children && this.props.children.props.children,
				data: tableData,
				columnsInfo: columnsInfo})}
			</div>
		);
  	}

}
