import React, { Component } from 'react';
import {connect} from 'react-redux';
import SchedulerConnector from './TableColumnAppenders/SchedulerConnector'
import * as actionTypes from './store/actions/actionTypes'
import TreeConnector from './TableColumnAppenders/TreeConnector';
import { Table, cats } from '@execview/table';
import { columnsInfo, cellTypes, rules } from './store/config';
import { PropInspector, Button } from '@execview/reusable'
import classes from './App.module.css';

class App extends Component {
	componentDidMount() {
		this.props.onGetLocalData();
	}

  	render() {
			const randomNumber = Math.floor((Math.random() * cats.length));
    	return (
			<div className={classes["App"]}>
				<div className={classes["button-container"]}>
					<Button onClick={()=>this.props.onAddRow(Object.keys(columnsInfo))}>Add Row</Button>
				</div>
				{Object.keys(this.props.data).length !== 0 && <TreeConnector
					data={this.props.data}
					columnsInfo={columnsInfo}
					editableCells={this.props.editableCells}
					cellTypes={cellTypes}
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
		data: state._data,
		editableCells: state.editableCells
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGetLocalData: ()=>dispatch({type: actionTypes.LOAD_FROM_CONFIG}),
		onAddRow: (columns) => dispatch({type: actionTypes.ADD_ROW, parent:'_1235d', shape:'square', columns})
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
