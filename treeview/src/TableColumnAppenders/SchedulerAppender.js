import React, { Component } from 'react';
import TreeConnector from './TreeConnector';
import SchedulerHeader from '../SchedulerHeader'


export default class SchedulerAppender extends Component {
	constructor(){
		super()
		this.tableRef= React.createRef();
		this.dateNum = 1
	}

	addSchedulerColumn = ()=>{
		const schedulerheaderdata = {start:this.dateNum, tableRef:this.tableRef}
		this.dateNum+=1
		return {...this.props.columnsInfo, scheduler: {...this.props.columnsInfo.scheduler, headerData: schedulerheaderdata}}
	}

	addSchedulerData() {
		const displayedRows = Object.keys(this.props.data)
		let tableData = {...this.props.data}
		for(let i=0; i<displayedRows.length; i++){
			const rowId = displayedRows[i]
			tableData[rowId] = {...tableData[rowId],
									scheduler:{...tableData[rowId],
										//Bubble Data
										key: rowId,
										middleclickdown:(()=>console.log("Injected function!!!")),
										text:tableData[rowId].activityTitle,
									}
								}
		}
		return tableData
	}
	
  	render() {
    	return (
			<div ref={this.tableRef}>
				<TreeConnector
					{...this.props} 
					data={this.addSchedulerData()}
					columnsInfo={this.addSchedulerColumn()}
					
				/>
			</div>
		);
  	}

	
}
