/* eslint-disable guard-for-in */
import React, {useState} from 'react';
//import Table from '../table/OldTable';
import Table from '../table/Table';
import './TableWrapper.css';

const TableWrapper = (props) => {

	const [selfColumnsInfo, setSelfColumnsInfo] = useState(props.columnsInfo)
	const [columnsInfo, setColumnsInfo] = props.setColumnsInfo ? [props.columnsInfo, props.setColumnsInfo] : [selfColumnsInfo, setSelfColumnsInfo]

	const permissions = props.permissions || {};

	const tableData = {};
	for (const row in props.data) {
		const rowIsEditable = (permissions.editableRows && permissions.editableRows.includes(row)) || (!props.permissions && props.onSave) // editableRows contains the row or no permissions are given + there is an onSave (i.e every row is probably editable)
		for (const col in columnsInfo) {
			if (!tableData[row]) { tableData[row] = {}; }
			const errorTextCell = props.errors && props.errors.find(cell=>cell.row===row && cell.col ===col)
			const cell = {
				isEditable: rowIsEditable && !(permissions.exceptions && permissions.exceptions.find(cell=>cell.row===row && cell.col ===col)),
				data: props.data[row][col],
				errorText: errorTextCell && errorTextCell.errorText
			};
			tableData[row][col] = cell;
		}
	}

/*
	permissions = {
		editableRows: [
			'_1','_2','_4','_5'
		],
		exceptions: [
			{row: '_2', col: 'start'},
			{row: '_4', col: 'start'},
		]
	}
	
	errors = [
		{row: a, col: 'start', errorText: 'no'},
		{row: d, col: 'test', errorText: 'why'}
	]
*/

	return (
		<div style={{ width: '100%', userSelect: 'none' }}>
			<Table
				data={tableData}
				columnsInfo={columnsInfo}
				cellTypes={props.cellTypes}
				onSave={props.onSave}
				selectedRow={props.selectedRow}
				getContextMenu={props.getContextMenu}
			/>
		</div>
	);
}

export default TableWrapper