import React, { useState, useEffect } from 'react';
import {connect} from 'react-redux';
import useScheduler from './TableColumnAppenders/useScheduler.js'
import * as actionTypes from './store/actions/actionTypes.js'
import useTree from './TableColumnAppenders/useTree.js';
import { Table, cats } from '@execview/table';
import { columnsInfo as columnsInfoConfig, cellTypes } from './store/config.js';
import { Button } from '@execview/reusable'
import classes from './App.module.css';
import useVisibleColumns from './TableColumnAppenders/useVisibleColumns.js';
import { useThemeApplier, defaultTheme } from '@execview/themedesigner'

const App = (props) => {
	useThemeApplier(defaultTheme)

	const data = props.data || {}
	const [columnsInfo, setColumnsInfo] = useState(columnsInfoConfig)
	const [changes, setChanges] = useState()

	useEffect(()=>{
		props.onGetLocalData();
	},[])

	const [selectedRow, setSelectedRow] = useState();
	const [showEnddate, setShowEnddate] = useState(false)


	const randomNumber = Math.floor((Math.random() * cats.length));
	const treeOptions = {position: 'start'};
	const schedulerOptions = {position: 'end', width: 50};
	const filteredColumns = ['enddate'].filter(e=>e!=='enddate' || showEnddate)

	const onSave = (row, col, data) => {
		if(col==='startdate' || col==='enddate' || col==='scheduler'){
			let changes = {}
			if(col!=='scheduler'){changes = {[col]: data}} else {changes = data}
			props.tryBubbleTransform(row, changes)
		} else {
			props.saveRow(row, col, data)
		}
	}

	const onMouseUp = () => {
		props.sendChanges(props.itemChanges);
		props.clearChanges()
	}
	
	let [a,b] = useTree(data,columnsInfo,{
		setSelectedRow:(itemId) =>selectedRow === itemId ? setSelectedRow(null): setSelectedRow(itemId),
		selectedRow: selectedRow,
		treeOptions: treeOptions
	})

	const [c,d,tableRef] = useScheduler(a,b,{
		onSave: onSave,
		onMouseUp: onMouseUp,
		schedulerOptions: schedulerOptions,
		onRemoveLink: props.onRemoveLink,
		deleteBubble: props.onDeleteBubble,
		tryPerformLink: props.tryPerformLink,
		tryPerformAssociation: props.tryPerformAssociation,
	})
	const e = useVisibleColumns(d,filteredColumns)
	const [newData, newColumnsInfo] = [c,e]

	return (
		<div className={`${classes["App"]} ${classes['color-scheme']}`}>
			<div className={classes["button-container"]}>
				<Button onClick={()=>props.onAddRow(selectedRow)}>Add Row</Button>
				<Button onClick={()=>setShowEnddate(!showEnddate)}>Toggle Enddate</Button>
			</div>
			{<Table
				itemChanges={props.itemChanges}
				data={newData}
				columnsInfo={newColumnsInfo}
				setColumnsInfo={setColumnsInfo}
				cellTypes={cellTypes}
				dontPreserveOrder={true}
				tableRef={tableRef}
				selectedRow={selectedRow}
				onSave={onSave}
			/>}
			<div style={{ margin: 'auto', marginTop: '30px', maxWidth: '400px' }}>
				<img draggable='false' style={{ marginTop: '30px', maxWidth: '100%' }} src={cats[randomNumber]} alt="xd" />
			</div>
		</div>
	);
}

const mapStateToProps = state => {
	return {
		data: state._data,
		itemChanges: state.itemChanges
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		tryBubbleTransform: (key,changes) => dispatch({type: actionTypes.TRY_BUBBLE_TRANSFORM, key, changes}),
		saveRow: (row,col,data) => dispatch({type: actionTypes.SAVE_ROW, row, col, data}),
		tryPerformLink: (childkey,parentkey,childside,parentside) => dispatch({type: actionTypes.TRY_PERFORM_LINK,parentkey,childkey,parentside,childside}),
		tryPerformAssociation: (parentkey,childkey) => dispatch({type: actionTypes.TRY_PERFORM_ASSOCIATION,childkey,parentkey}),
		onRemoveLink: (key) => dispatch({type: actionTypes.UNLINK_PARENT_BUBBLE, key}),
		onDeleteBubble: (key) => dispatch({type: actionTypes.DELETE_BUBBLE, key}),
		onGetLocalData: ()=>dispatch({type: actionTypes.LOAD_FROM_CONFIG}),
		onAddRow: (parent) => dispatch({type: actionTypes.ADD_ROW, parent: parent, shape:'square'}),
		sendChanges: (changes) => dispatch({type: actionTypes.SEND_CHANGES, itemChanges:changes}),
		clearChanges: () => dispatch({type: actionTypes.CLEAR_CHANGES})
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
