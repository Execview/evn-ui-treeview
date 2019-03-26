import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';
import SchedulerConnector from './TableColumnAppenders/SchedulerConnector'
import { columnsInfo, cellTypes, editableCells } from './config';
import * as actionTypes from './actionTypes'
import * as actionCreators from './actionCreators'
import TreeConnector from './TableColumnAppenders/TreeConnector';
import Table from './TEMP-TABLE/table/Table';
import JamesTest from './JamesTest'

class App extends Component {
	componentDidMount() {
		this.props.onGetInitialData();
		//this.props.loadpls();
	}

  	render() {
    	return (
			<div className="App">
				{this.props.data !== null && <SchedulerConnector 
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
				}
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
	onGetInitialData: () => dispatch(actionCreators.getInitialData()),
    onSave: (rowId, rowValues, editableValues) => dispatch({ type: actionTypes.SAVE_TABLE, rowId, rowValues, editableValues }),
	loadpls: ()=>dispatch({type:"loadFromConfig"})
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
