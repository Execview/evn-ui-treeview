import React, {useState, useEffect} from 'react';
import Row from '../row/Row';
import Cell from '../cells/Cell/Cell';
import Spans from './Spans';
import './Table.css';

const Table = (props) => {
	const data = props.data
	const columnsInfo = props.columnsInfo
	const cellTypes = props.cellTypes
	const onSave = props.onSave
	const dataSort = props.dataSort || {};

	const [currentSort, setCurrentSort] = useState({}) //{col: 'RAG', asc: 'desc'}
	const [widths, setWidths] = useState(Object.fromEntries(Object.keys(columnsInfo).map(k=>[k,'auto'])))

	
	const resizerThing = <div>|</div>

	const onClickHeader = (col) => {
		setCurrentSort({col: col, asc: !currentSort.asc})
	}
	
	return (
		<table>
			<thead>
				<tr style={{display:'grid', gridTemplateColumns: Object.keys(columnsInfo).reduce((t,col)=>`${t} [${col}] ${widths[col]}`,'')}}>
					{Object.keys(columnsInfo).map((col, i) => {
						const column = columnsInfo[col];
						let spans = 'both';
						if (dataSort && dataSort[column.cellType]) {
							if (currentSort.col) {
								spans = col === currentSort.col ? (currentSort.asc ? 'arrow-down' : 'arrow-up') : '';
							}
						} else {
							spans = '';
						}
						if(spans){console.log(spans)}
						const headerType = typeof (column.headerType) === 'string' ? cellTypes[column.headerType] : column.headerType
						const headerData = column.headerData;
						return (
							<th onClick={()=>onClickHeader(col)}>
								<div style={{display: 'flex', alignItems: 'center', border: '1px solid red', gridColumnStart: col}}>
									<Spans spans={spans} />
									{/* {resizerThing} */}
									<Cell data={headerData} type={headerType} isEditable={false} />
								</div>
							</th>
						);
					})}
				</tr>
			</thead>
			<tbody>
				{Object.keys(data).map((row,i) => {
					return (
						<tr>
							{Object.keys(columnsInfo).map((col, j) => {
								const column = columnsInfo[col]
								const type = typeof (column.cellType) === 'string' ? cellTypes[column.cellType] : column.cellType
								const cell = data[row][col] || {};
								return (
									<td style={{border: '1px solid red'}}>
										{/* {resizerThing} */}
										<Cell data={cell.data} type={type} isEditable={cell.isEditable}/>
									</td>
								);
							})}
						</tr>
					);
				})}
			</tbody>
		</table>
	) 	
}
// 	return (
// 		<table className={'table ' + (style.table || '')} ref={props.tableRef}>
// 			<thead>
// 				<tr className={'table-row ' + (style.tableRow || 'table-row-visuals')}>
// 					{Object.keys(state.columnsInfo).map((colkey, index) => {
// 						const col = state.columnsInfo[colkey];
// 						const lastOne = index === Object.keys(state.columnsInfo).length - 1;

						// let spans = 'both';
						// if (props.dataSort && props.dataSort[col.cellType]) {
						// 	if (state.column) {
						// 		spans = colkey === state.column ? (state.order === 'desc' ? 'arrow-down' : 'arrow-up') : '';
						// 	}
						// } else {
						// 	spans = '';
						// }

						// let data = null;
						// const headerStyle = { width: Math.round(state.widths[colkey]), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
						// let type = null;
						// if (col.headerType) {
						// 	data = col.headerData;
						// 	type = typeof (col.headerType) === 'string' ? props.cellTypes[col.headerType] : col.headerType;
						// 	headerStyle.width = state.widths[colkey] - 10;
						// } else {
						// 	headerStyle.width = Math.floor(state.widths[colkey]);
						// 	data = { spans, title: col.headerData, sortData: () => { if (props.dataSort && props.dataSort[col.cellType]) { sortData(colkey, col.cellType); } }, };
						// 	type = <HeaderCellDisplay />;
						// }

						// return (
						// 	<th className={'table-header ' + (style.tableHeader || 'table-header-visuals')} key={colkey} style={{ width: state.widths[colkey] }}>
						// 		<Cell data={data} style={headerStyle} type={type} />
						// 		{!lastOne && <div style={{ touchAction: 'none', position: 'absolute', WebkitTransform: 'translate(7px)', transform: 'translateX(7px)', top: 0, right: 0, height: '100%', width: '15px', cursor: 'w-resize' }} onPointerDown={e => onMouseDown(e, colkey)} onPointerUp={stopPr} />}
						// 	</th>
						// );
// 					})}
// 				</tr>
// 			</thead>
// 					<tbody>
// 						{state.orderedData.map((entry) => {
// 							let rowStyles = {};
// 							if (props.selectedRow === entry) {
// 								rowStyles = { ...rowStyles, backgroundColor: '#3a414f' };
// 							}	
// 							return (
// 								<tr className={'table-row ' + (style.tableRow || 'table-row-visuals')} key={`tr${entry}`} style={rowStyles}>
// 									<Row
// 										columnsInfo={props.columnsInfo}
// 										editableCells={state.editableCells[entry]}
// 										invalidCells={state.invalidCells.filter(obj => obj.id === entry).map(el => el.col)}
// 										rowData={state.data[entry]}
// 										widths={state.widths}
// 										heights={state.heights}
// 										cellTypes={props.cellTypes}
// 										onValidateSave={(col, data) => validateSave(entry, col, data)}
// 										rules={props.rules}
// 										onMouseDown={onMouseDown}
// 										style={style}
// 									/>
// 								</tr>
// 							);
// 						})}
// 					</tbody>
// 				</table>
// 	)
// }


// const getUniqueColumns = (data) => {
// 	let uniqueColumns = []
// 	for(const key in data){
// 		const row = data[key]
// 		for(const col in row){
// 			if(!uniqueColumns.includes(col)){
// 				uniqueColumns.push(col)
// 			}
// 		}
// 	}
// 	return uniqueColumns;
// };


export default Table