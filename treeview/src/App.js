import React, { Component } from 'react';
import {connect} from 'react-redux';
import './App.css';
import SchedulerConnector from './TableColumnAppenders/SchedulerConnector'
import { columnsInfo, cellTypes, rules } from './store/config';
import * as actionTypes from './store/actions/actionTypes'
import * as actionCreators from './store/actions/actionCreators'
import TreeConnector from './TableColumnAppenders/TreeConnector';
import Table from './TEMP-TABLE/table/Table';
import AddRow from './AddRow';
import { cats } from './TEMP-TABLE/store/ElCatso';
import './App.css'

class App extends Component {
	componentDidMount() {
		// this.props.onGetInitialData();
		this.props.onGetLocalData();
	}

  	render() {
			const randomNumber = Math.floor((Math.random() * 35));
    	return (
			<div className="App">
				<AddRow addRow={this.props.onAddRow} columnsInfo={columnsInfo}/>
				{this.props.data !== null && <TreeConnector
					data={this.props.data}
					columnsInfo={columnsInfo}
					editableCells={this.props.editableCells}
					cellTypes={cellTypes}
					onSave={this.props.onSave}
					dontPreserveOrder={true}
					wrap={false}
					rules={rules}
				>
					<SchedulerConnector>
						<Table />
					</SchedulerConnector>
				</TreeConnector>}
				<div style={{ margin: 'auto', marginTop: '30px', maxWidth: '400px' }}>
					<img draggable='false' style={{ marginTop: '30px', maxWidth: '100%' }} src={cats[randomNumber]} alt="xd" />
				</div>
			</div>

		);
  	}
}

const mapStateToProps = state => {
	return {
		data: state.displayedData,
		editableCells: state.editableCells
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGetInitialData: () => dispatch(actionCreators.getInitialData()),
		onSave: (rowId, rowValues, editableValues) => dispatch({ type: actionTypes.SAVE_TABLE, rowId, rowValues, editableValues }),
		onGetLocalData: ()=>dispatch({type: actionTypes.LOAD_FROM_CONFIG}),
		onAddRow: () => dispatch({type: actionTypes.ADD_ROW})
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
