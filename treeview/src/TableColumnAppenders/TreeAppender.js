import React, { Component } from 'react';
import Table from '../TEMP-TABLE/table/Table'

import SchedulerHeader from '../SchedulerHeader'
import SchedulerOverlay from '../SchedulerOverlay';

export default class TreeAppender extends Component {
	constructor(props){
		super(props)
		this.state = { rowHeights: []}
	}

	addTreeData = ()=>{
		//inject TreeExpander data and SchedulerCell Bubble data.
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

  	render() {
		const tableData = this.addTreeData()
    	return (
			<div className="table-container">
				<div>
					<Table //TODO: Remove extra props before spreading!
						{...this.props}
						data={tableData}
					/>	
					<SchedulerOverlay />
				</div>
			</div>
		);
  	}
	
}
