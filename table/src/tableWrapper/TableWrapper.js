/* eslint-disable guard-for-in */
import React, {useState} from 'react';
import Table from '../table/Table';
import './TableWrapper.css';

const TableWrapper = (props) => {

	const [internalColumnChanges, setInternalColumnChanges] = useState({})

	const appendInternalColumnChanges = (ci, changes) => Object.fromEntries(Object.entries(ci).map(([k,col])=>[k,{...col,...changes[k]}]))
	const alterInternalColumns = (newCi) => setInternalColumnChanges(Object.fromEntries(Object.entries(newCi).map(([k,col])=>{
		const selfManagedProperties = ['width']
		const alterations = Object.fromEntries(Object.entries(col).filter(([k,v])=>selfManagedProperties.includes(k)))
		return [k,alterations]
	})))


	const [columnsInfo, setColumnsInfo] = props.setColumnsInfo ? [props.columnsInfo, props.setColumnsInfo] : [appendInternalColumnChanges(props.columnsInfo, internalColumnChanges),alterInternalColumns]

	//rows have a meta property containing permission: n, and errors: {col: 'error text'}
	const tableData = {};
	for (const row in props.data) {
		for (const col in columnsInfo) {
			if (!tableData[row]) { tableData[row] = {}; }
			const permission = (props.data[row].meta && (props.data[row].meta.exceptions && props.data[row].meta.exceptions[col] || props.data[row].meta.permission)) || 1
			const cell = {
				permission: permission,
				data: props.data[row][col],
				errorText: props.data[row].meta && props.data[row].meta.errors && props.data[row].meta.errors[col] 
			};
			tableData[row][col] = cell;
		}
	}

	return (
		<div style={{ width: '100%', userSelect: 'none' }}>
			<Table
				data={tableData}
				columnsInfo={columnsInfo}
				setColumnsInfo={setColumnsInfo}
				onSave={props.onSave}
				selectedRow={props.selectedRow}
				getContextMenu={props.getContextMenu}
				tableRef={props.tableRef}
			/>
		</div>
	);
}

export default TableWrapper
