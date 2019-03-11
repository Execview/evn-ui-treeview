import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';
import SchedulerConnector from './TableColumnAppenders/SchedulerConnector'
import { columnsInfo, cellTypes, editableCells } from './config';
import * as actionTypes from './actionTypes'
import TreeConnector from './TableColumnAppenders/TreeConnector';
import Table from './TEMP-TABLE/table/Table';
import SchedulerAppender from './TableColumnAppenders/SchedulerAppender';

class App extends Component {
	// App -> SchedulerConnector -> SchedulerAppender -> TreeConnector -> TreeAppender -> Table
	//React.cloneElement(this.props.children, {...this.props})}

  	render() {
    	return (
			<div className="App">
				<SchedulerConnector 
					data={this.props.data}
					columnsInfo={columnsInfo}
					editableCells={editableCells}
					cellTypes={cellTypes}
					tableWidth={1800}
					onSave={this.props.onSave}
					dontPreserveOrder={true}
					wrap={true}
				>
					<TreeConnector>
						<Table />
					</TreeConnector>
				</SchedulerConnector>
			</div>
		);
  	}
}

const mapStateToProps = state => {
	return {
		data: state.displayedData,
	}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onSave: (rowId, rowValues, editableValues) => dispatch({ type: actionTypes.SAVE_TABLE, rowId, rowValues, editableValues }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
