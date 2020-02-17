import React from 'react';
import Cell from '../cells/Cell/Cell';
import TextCell from '../cells/TextCell/TextCell'
import './Row.css';


const Row = (props) => {
	const editableCells = props.editableCells || [];
	const columnsInfo = props.columnsInfo || Object.keys(props.rowData).reduce((total, objKey) => { return { ...total, [objKey]: { cellType: 'text', colTitle: objKey } }; }, {});
	const keys = Object.keys(columnsInfo);
	const invalidCells = props.invalidCells || [];
	const widths = props.widths || keys.reduce((total, objKey) => { return { ...total, [objKey]: 200 }; }, {});
	const heights = props.heights || keys.reduce((total, objKey) => { return { ...total, [objKey]: 0 }; }, {});
	const cellTypes = props.cellTypes || { text: <TextCell /> };
	const rules = props.rules || {};
	const onMouseDown = props.onMouseDown || (() => false);
	const cellStyleClass = props.style || {};
	return (
		keys.map((col, index) => {
			const editRights = editableCells.includes(col);
			const red = invalidCells.includes(col);
			const columnCellType = typeof(columnsInfo[col].cellType)==='string' ? cellTypes[columnsInfo[col].cellType] : columnsInfo[col].cellType

			const lastOne = index === keys.length - 1;
			const errorText = rules[columnsInfo[col].rule] ? rules[columnsInfo[col].rule].errorMessage : null;
			return (
				<td className={'table-datum ' + (cellStyleClass.tableDatum || 'table-datum-visuals')} key={col}>
					{!lastOne && props.onMouseDown && <div style={{ touchAction: 'none', position: 'absolute', transform: 'translateX(7px)', top: 0, right: 0, height: '100%', width: '15px', cursor: 'w-resize', zIndex: 1 }} onPointerDown={e => onMouseDown(e, col)} />}
					<div
						title={columnsInfo[col].colTitle}
						className={'table-label ' + (editRights ? '' : 'no-edit')}
					>
						<Cell
							data={props.rowData[col]}
							type={columnCellType}
							isEditable={editRights}
							onValidateSave={data => props.onValidateSave(col, data)}
							errorText={red ? errorText : null}
						/>
					</div>
				</td>
			);
		})
	);
};

export default Row;
