import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import SchedulerConnector from './TableColumnAppenders/SchedulerConnector'
import * as actionTypes from './store/actions/actionTypes'
import TreeConnector from './TableColumnAppenders/TreeConnector';
import { Table, cats } from '@execview/table';
import { columnsInfo, cellTypes, rules } from './store/config';
import { PropInspector, Button } from '@execview/reusable'
import classes from './App.module.css';
import VisibleColumnSelector from './TableColumnAppenders/VisibleColumnSelector';

const App = (props) => {

	useEffect(()=>{
		props.onGetLocalData();
	},[])

	const [selectedRow, setSelectedRow] = useState();

	const [showEnddate, setShowEnddate] = useState(false)

	const rowheight = 30
	const randomNumber = Math.floor((Math.random() * cats.length));
	const treeOptions = {width: 10, position: 'start'};
	const schedulerOptions = {width:65, position: 'end'};
	const filteredColumns = ['enddate'].filter(e=>e!=='enddate' || showEnddate)
	return (
		<div className={`${classes["App"]} ${classes['color-scheme']}`}>
			<div className={classes["button-container"]}>
				<Button onClick={()=>props.onAddRow(Object.keys(columnsInfo),selectedRow)}>Add Row</Button>
				<Button onClick={()=>setShowEnddate(!showEnddate)}>Toggle Enddate</Button>
			</div>
			{Object.keys(props.data).length !== 0 && <TreeConnector
				itemChanges={props.itemChanges}
				setSelected={(itemId) =>{selectedRow === itemId ? setSelectedRow(null): setSelectedRow(itemId)}}
				selectedRow={selectedRow}
				data={props.data}
				columnsInfo={columnsInfo}
				editableCells={props.editableCells}
				cellTypes={cellTypes}
				dontPreserveOrder={true}
				wrap={false}
				rules={rules}
				treeOptions={treeOptions}
				schedulerOptions={schedulerOptions}
				filteredColumns={filteredColumns}
			>
				<SchedulerConnector>
					<VisibleColumnSelector>
							<Table />
					</VisibleColumnSelector>
				</SchedulerConnector>
			</TreeConnector>}
			<div style={{ margin: 'auto', marginTop: '30px', maxWidth: '400px' }}>
				<img draggable='false' style={{ marginTop: '30px', maxWidth: '100%' }} src={cats[randomNumber]} alt="xd" />
			</div>
		</div>
	);
}

const mapStateToProps = state => {
	return {
		data: state._data,
		editableCells: state.editableCells,
		itemChanges: state.itemChanges
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		onGetLocalData: ()=>dispatch({type: actionTypes.LOAD_FROM_CONFIG}),
		onAddRow: (columns,parent) => dispatch({type: actionTypes.ADD_ROW, parent: parent, shape:'square', editableCells:columns})
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
