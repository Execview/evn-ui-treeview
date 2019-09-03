/* eslint-disable guard-for-in */
import React, {useState, useEffect} from 'react';
import Table from '../table/OldTable';
//import Table from '../table/Table';
import './TableWrapper.css';

const TableWrapper = (props) => {
	// const tableData = {};
	// for (const row in props.data) {
	// 	for (const col in props.data[row]) {
	// 		if (!tableData[row]) { tableData[row] = {}; }
	// 		const cell = {
	// 			isEditable: props.editableCells[row].includes(col),
	// 			data: props.data[row][col],
	// 			errorText: null
	// 		};
	// 		tableData[row][col] = cell;
	// 	}
	// }

	let [columnsInfo,setColumnsInfo] = useState(props.columnsInfo);

	useEffect(()=>{
		setColumnsInfo(props.columnsInfo)
	},[props.columnsInfo])

	const changeColumnsInfo = () => {
		setColumnsInfo(Object.fromEntries(Object.entries(columnsInfo).filter(([k,v],i)=>i!==0)))
	}

	const addColumnsInfo = () => {
		setColumnsInfo({ ...columnsInfo, progress: { cellType: 'color', headerData: 'RAG', minWidth: 25 } });
	}

	return (
		<div style={{ width: '100%', userSelect: 'none' }}>
			<button onClick={changeColumnsInfo}>-</button>
			<button onClick={addColumnsInfo}>+</button>
			<Table
				data={props.data}
				columnsInfo={columnsInfo}
				cellTypes={props.cellTypes}
				onSave={props.onSave}
				dataSort={props.dataSort}
				editableCells={props.editableCells} /* for oldTable */
				rules={props.rules} /* for oldTable */
				selectedRow={props.selectedRow}
				getContextMenu={props.getContextMenu}
			/>
		</div>
	);
}
// data = {
// 	row1: {
// 		col1: {
// 			isEditable: true,
// 			data: w/e,
// 			errorText,
// 		}
// 	}
// }


/* const style = props.style || {};
	const [data, setData] = useState(props.data);
	const [orderedData, setOrderedData] = useState(Object.keys(data)); 
	const [editableCells, setEditableCells] = useState(props.editableCells);
	const [invalidCells, setInvalidCells] = useState({});

	useEffect(() => {
		const newData = props.data;
		const keys = Object.keys(newData);
		if (!props.dontPreserveOrder) {
			const alreadyOrderedData = orderedData.filter(el => keys.includes(el));
			const dataToAdd = keys.filter(el => !orderedData.includes(el));
			setOrderedData(alreadyOrderedData.concat(dataToAdd));
		}
		const newInvalidCells = invalidCells.filter(el => keys.includes(el.id));
		newInvalidCells.forEach((ic) => {
			newData[ic.id] = data[ic.id];
		});
		setData(newData);
		setInvalidCells(newInvalidCells);
	}, [props.data]);

	useEffect(() => {
		const newEditableCells = {};
		for(const key in data){
			newEditableCells[key] = props.editableCells ? props.editableCells[key] || [] : [];
		};
		setEditableCells(newEditableCells);
	}, [props.editableCells]);

	const columnsInfo = props.columnsInfo || getUniqueColumns(data).reduce((total, uniqueColumn) => { return { ...total, [uniqueColumn]: { cellType: 'text', headerData: uniqueColumn } }; }, {});
 */


export default TableWrapper