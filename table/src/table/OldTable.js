import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Row from '../row/Row';
import Cell from '../cells/Cell/Cell';
import HeaderCellDisplay from './HeaderCellDisplay';
import { OCO } from '@execview/reusable'
import './Table.css';

// KNOWN BUG: MILLION RERENDERS

export default class Table extends Component {
	constructor(props) {
		super(props);
		const defaults = this.getDefaults(props);
		let maxTableWidth = 100;
		const keys = Object.keys(defaults.columnsInfo);
		
		const initialWidths = {};
		for (let i = 0; i < keys.length; i++) {
			const colWidth = defaults.columnsInfo[keys[i]].width
			if (colWidth) {
				maxTableWidth -= colWidth;
				initialWidths[keys[i]] = colWidth;
			}
		}

		const widthKeys = Object.keys(initialWidths);
		if (keys.length !== widthKeys.length) {
			const keysLeft = keys.filter(el => !widthKeys.includes(el));
			const defaultWidth = maxTableWidth / keysLeft.length;
			for (let i = 0; i < keysLeft.length; i++) {
				initialWidths[keysLeft[i]] = defaultWidth;
			}
		}
		const minWidths = keys.reduce((total, key) => { return { ...total, [key]: defaults.columnsInfo[key].minWidth || 70 }; }, {});
		const data = this.props.data || {};
		const minHeights = keys.reduce((total, key) => { return { ...total, [key]: defaults.columnsInfo[key].height || 0 }; }, {});

		this.state = {
			columnsInfo: defaults.columnsInfo,
			widths: { ...initialWidths },
			minWidths: { ...minWidths },
			tableWidth: 100,
			heights: minHeights,
			columnClicked: null,
			positionClicked: null,
			initialWidth: null,
			nextInitialWidth: null,
			column: '',
			order: 'desc',
			orderedData: Object.keys(data),
			invalidCells: [],
			data: this.props.data,
			editableCells: defaults.editableCells,
			onSave: defaults.onSave,
			contextMenu: null
		};
		this.resizeTable = this.resizeTable.bind(this);
	}

	componentDidMount() {
		this.resizeTable();
		window.addEventListener('resize', this.resizeTable);
		this.props.onRender && this.props.onRender();
	}

	componentWillReceiveProps(newProps) {
		const defaults = this.getDefaults(newProps);

		const keys = Object.keys(newProps.data);
		let newOrderedData = Object.keys(newProps.data);
		if (!newProps.dontPreserveOrder) {
			const alreadyOrderedData = this.state.orderedData.filter(el => keys.includes(el));
			const dataToAdd = keys.filter(el => !this.state.orderedData.includes(el));

			newOrderedData = alreadyOrderedData.concat(dataToAdd);
		}
		const newData = newProps.data;
		const newInvalidCells = this.state.invalidCells.filter(el => keys.includes(el.id));
		for (let i = 0; i < newInvalidCells.length; i++) {
			newData[newInvalidCells[i].id] = this.state.data[newInvalidCells[i].id];
		}

		this.setState({
			columnsInfo: defaults.columnsInfo,
			orderedData: newOrderedData,
			data: newData,
			editableCells: defaults.editableCells,
			onSave: defaults.onSave
		}, this.resizeTable);
	}

	componentDidUpdate() {
		this.props.onRender && this.props.onRender();
		this.resizeTable();
	}

	componentWillUnmount() {
		window.removeEventListener('resize', this.resizeTable);
	}

	getDefaults(props) {
		const toReturn = {
			columnsInfo: props.columnsInfo,
			editableCells: {},
			onSave: (props.onSave || this.defaultOnSave)
		};
		const getUniqueColumns = (data) => {
			let uniqueColumns = []
			for(const key in data){
				const row = data[key]
				for(const col in row){
					if(!uniqueColumns.includes(col)){
						uniqueColumns.push(col)
					}
				}
			}
			return uniqueColumns;
		};
		const data = props.data || {};
		toReturn.columnsInfo = props.columnsInfo || getUniqueColumns(data).reduce((total, uniqueColumn) => { return { ...total, [uniqueColumn]: { cellType: 'text', headerData: uniqueColumn } }; }, {});

		toReturn.editableCells = {};

		for(const key in data){
			toReturn.editableCells[key] = props.editableCells ? props.editableCells[key] || [] : [];
		}

		return toReturn;
	}

	defaultOnSave = ((rowId, rowData, editableData) => {
		this.setState({
			data: {
				...this.state.data,
				[rowId]: rowData
			},
			editableCells: {
				...this.state.editableCells,
				[rowId]: editableData
			}
		});
	});

	onMouseDown = (e, colName) => {
		e.stopPropagation();
		e.preventDefault();
		const nextCol = Object.keys(this.state.columnsInfo)[Object.keys(this.state.columnsInfo).indexOf(colName) + 1];
		const newX = e.clientX;
		this.setState({ positionClicked: newX, columnClicked: colName, initialWidth: this.state.widths[colName], nextInitialWidth: this.state.widths[nextCol] });
		document.addEventListener('pointermove', this.onMouseMove);
		document.addEventListener('pointerup', this.removeListener);
	}

	onMouseMove = (e) => {
		e.stopPropagation();
		e.preventDefault();
		const currentX = e.clientX;
		const newVal = this.state.initialWidth + currentX - this.state.positionClicked;
		const nextCol = Object.keys(this.state.columnsInfo)[Object.keys(this.state.columnsInfo).indexOf(this.state.columnClicked) + 1];
		const nextVal = this.state.nextInitialWidth - currentX + this.state.positionClicked;
		if (newVal < this.state.minWidths[this.state.columnClicked] || nextVal < this.state.minWidths[nextCol]) {
			return;
		}
		this.setState({ widths: { ...this.state.widths, [this.state.columnClicked]: newVal, [nextCol]: nextVal } });
	}

	removeListener = (e) => {
		e.stopPropagation();
		e.preventDefault();
		this.setState({ positionClicked: null });
		document.removeEventListener('pointermove', this.onMouseMove);
		document.removeEventListener('pointerup', this.removeListener);
	}

	validateSave = (rowId, colId, cellText) => {
		let newInvalidCells = [...this.state.invalidCells];
		const editableRow = [...this.state.editableCells[rowId]];
		const updatedRow = { ...this.state.data[rowId] };
		updatedRow[colId] = cellText;
		let objReturned = { updatedRow, editableRow };
		if (this.props.rowValidation) {
			objReturned = this.props.rowValidation(updatedRow, editableRow);
		}
		let hasErrors = false;
		for (const column in this.state.columnsInfo) {
			if (this.state.columnsInfo[column].rule) {
				if (!this.props.rules[this.state.columnsInfo[column].rule].validator(objReturned.updatedRow[column])) {
					hasErrors = true;
					if (!newInvalidCells.find(el => el.id === rowId && el.col === column)) {
						newInvalidCells.push({ id: rowId, col: column });
					}
				} else {
					newInvalidCells = newInvalidCells.filter(obj => !(obj.id === rowId && obj.col === column));
				}
			}
		}

		
		this.setState({
			data: {
				...this.state.data,
				[rowId]: objReturned.updatedRow
			},
			editableCells: {
				...this.state.editableCells,
				[rowId]: objReturned.editableRow
			},
			invalidCells: newInvalidCells,
		});

		if (!hasErrors) { this.state.onSave(rowId, objReturned.updatedRow, objReturned.editableRow); }
	}

	sortData(col, cellType) {
		let ordering = this.state.order;
		let columnToOrder = this.state.column;
		if (columnToOrder === col) {
			ordering = this.state.order === 'asc' ? 'desc' : 'asc';
		} else {
			columnToOrder = col;
			ordering = 'asc';
		}
		const dataToOrder = this.state.orderedData.map((key) => { return ({ id: key, val: this.state.data[key][col] }); });

		dataToOrder.sort((a, b) => {
			return this.props.dataSort[cellType](a.val, b.val);
		});
		if (ordering === 'asc') {
			dataToOrder.reverse();
		}

		const dataToReturn = dataToOrder.map(obj => obj.id);

		this.setState({
			orderedData: dataToReturn,
			order: ordering,
			column: columnToOrder,
		});
	}

	resizeTable() {		
		const parentNode = ReactDOM.findDOMNode(this).parentNode;
		const windowWidth = window.getComputedStyle(parentNode, null).getPropertyValue('width').slice(0, -2);
		let newWidths = this.state.widths || {};
		let changes = false;

		const newColumns = Object.keys(this.state.columnsInfo).filter(col => !Object.keys(newWidths).includes(col));
		if (newColumns.length > 0) {
			newColumns.forEach((c) => {
				const cWidth = this.state.columnsInfo[c].width ? this.state.columnsInfo[c].width : 100 / Object.keys(this.state.columnsInfo).length;
				const scaleFactor = (100 - cWidth) / 100;
				newWidths = Object.keys(newWidths).reduce((total, col) => { return { ...total, [col]: newWidths[col] * scaleFactor }; }, {});
				newWidths[c] = (cWidth / 100) * this.state.tableWidth;
				changes = true;
			});
		}

		const removedColumns = Object.keys(newWidths).filter(col => !Object.keys(this.state.columnsInfo).includes(col));
		if (removedColumns.length > 0) {
			removedColumns.forEach((c) => {
				const cWidth = 100 * newWidths[c] / this.state.tableWidth;
				const scaleFactor = 100 / (100 - cWidth);
				newWidths = Object.keys(newWidths).filter(k => k !== c).reduce((total, col) => { return { ...total, [col]: newWidths[col] * scaleFactor }; }, {});
				changes = true;
			});
		}

		if (this.state.tableWidth !== windowWidth) {
			const finalWidths = {};
			const scaleFactor = windowWidth / this.state.tableWidth;

			const colsThatNeedMinWidth = Object.keys(newWidths).filter((col) => newWidths[col] * scaleFactor < this.state.minWidths[col]);
			for (const col of colsThatNeedMinWidth) { finalWidths[col] = this.state.minWidths[col]; }

			const spaceLeft = Math.max(colsThatNeedMinWidth.reduce((t, c) => t - this.state.minWidths[c], windowWidth), 0);

			const colsThatUsePercentage = Object.keys(newWidths).filter(c => !colsThatNeedMinWidth.includes(c));

			const originalPercentages = Object.fromEntries(Object.entries(newWidths).map(([c, w]) => [c, w / this.state.tableWidth]));
			
			const newScaleFactor = 1 / colsThatUsePercentage.reduce((t, c) => t + originalPercentages[c], 0);
			const colsThatUsePercentageNewPercentage = Object.fromEntries(colsThatUsePercentage.map((c) => [c, newScaleFactor * newWidths[c] / this.state.tableWidth]));


			for (const col in colsThatUsePercentageNewPercentage) {
				finalWidths[col] = Math.floor(Math.max(spaceLeft *colsThatUsePercentageNewPercentage[col], this.state.minWidths[col]));
			}
			
			newWidths = finalWidths;
			changes = true;
		}

		if (changes) {
			this.setState({ widths: newWidths, tableWidth: windowWidth });
		}
	}

	stopPr(e) {
		e.stopPropagation();
		e.preventDefault();
	}

	render() {
		const style = this.props.style || {};
		return (
			<div className={'horizontal-scroll'}>
				<table className={'table ' + (style.table || '')} ref={this.props.tableRef}>
					{React.createElement((this.props.noHeader ? 'tbody' : 'thead'), {}, (
						<tr className={'table-row ' + (style.tableRow || 'table-row-visuals')}>
							{Object.keys(this.state.columnsInfo).map((colkey, index) => {
								const col = this.state.columnsInfo[colkey];
								const lastOne = index === Object.keys(this.state.columnsInfo).length - 1;

								let spans = 'both';
								if (this.props.dataSort && this.props.dataSort[col.cellType]) {
									if (this.state.column) {
										spans = colkey === this.state.column ? (this.state.order === 'desc' ? 'arrow-down' : 'arrow-up') : '';
									}
								} else {
									spans = '';
								}

								let data = null;
								const headerStyle = { width: Math.round(this.state.widths[colkey]), overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
								let type = null;
								if (col.headerType) {
									data = col.headerData;
									type = typeof (col.headerType) === 'string' ? this.props.cellTypes[col.headerType] : col.headerType;
									headerStyle.width = this.state.widths[colkey] - 10;
								} else {
									headerStyle.width = Math.floor(this.state.widths[colkey]);
									data = { spans, title: col.headerData, sortData: () => { if (this.props.dataSort && this.props.dataSort[col.cellType]) { this.sortData(colkey, col.cellType); } }, };
									type = <HeaderCellDisplay />;
								}

								return (
									<th className={'table-header ' + (style.tableHeader || 'table-header-visuals')} key={colkey} style={{ minWidth: this.state.widths[colkey], position: 'relative' }} onContextMenu={(e)=>{e.preventDefault();this.setState({contextMenu: colkey})}}>
										{colkey === this.state.contextMenu && (
											<OCO OCO={() => this.setState({ contextMenu: null })}>
												{(this.props.getContextMenu && this.props.getContextMenu(colkey) || null)}
											</OCO>
										)}
										<Cell data={data} style={headerStyle} type={type} />
										{!lastOne && <div style={{ touchAction: 'none', position: 'absolute', WebkitTransform: 'translate(7px)', transform: 'translateX(7px)', top: 0, right: 0, height: '100%', width: '15px', cursor: 'w-resize' }} onPointerDown={e => this.onMouseDown(e, colkey)} onPointerUp={this.stopPr} />}
									</th>
								);
							})}
						</tr>
					))}
					<tbody>
						{this.state.orderedData.map((entry) => {
							let selectedRowClass = '';
							if (this.props.selectedRow === entry) {
								selectedRowClass = 'table-selected-row ';
							}
							
							return (
								<tr className={'table-row ' + (style.tableRow || 'table-row-visuals') + ' ' + selectedRowClass} key={`tr${entry}`} id={entry}>
									<Row
										columnsInfo={this.props.columnsInfo}
										editableCells={this.state.editableCells[entry]}
										invalidCells={this.state.invalidCells.filter(obj => obj.id === entry).map(el => el.col)}
										rowData={this.state.data[entry]}
										widths={this.state.widths}
										heights={this.state.heights}
										cellTypes={this.props.cellTypes}
										onValidateSave={(col, data) => this.validateSave(entry, col, data)}
										rules={this.props.rules}
										onMouseDown={this.onMouseDown}
										style={style}
									/>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
		);
	}
}
