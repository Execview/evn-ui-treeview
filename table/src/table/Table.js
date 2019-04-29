import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import Row from '../row/Row';
import Cell from '../cell/Cell';
import HeaderCellDisplay from './HeaderCellDisplay';
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
      if (defaults.columnsInfo[keys[i]].width) {
        maxTableWidth -= defaults.columnsInfo[keys[i]].width;
        initialWidths[keys[i]] = defaults.columnsInfo[keys[i]].width;
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
    const minWidths = Object.keys(defaults.columnsInfo).reduce((total, key) => { return { ...total, [key]: 70 }; }, {});

    this.state = {
      columnsInfo: defaults.columnsInfo,
      widths: { ...initialWidths },
      minWidths: { ...minWidths },
      tableWidth: 100,
      columnClicked: null,
      positionClicked: null,
      initialWidth: null,
      nextInitialWidth: null,
      column: '',
      order: 'desc',
      orderedData: Object.keys(props.data),
      activeCell: [null, null],
      invalidCells: [],
      data: this.props.data,
      editableCells: defaults.editableCells,
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

    // const maxTableWidth = ReactDOM.findDOMNode(this).parentNode.offsetWidth;
    // const initWidth = maxTableWidth / Object.keys(defaults.columnsInfo).length;
    // const initialWidths = Object.keys(defaults.columnsInfo).reduce((total, key) => { return { ...total, [key]: initWidth }; }, {});
    // const minWidths = Object.keys(defaults.columnsInfo).reduce((total, key) => { return { ...total, [key]: 5 }; }, {});

    // let newTableWidth = this.state.tableWidth;
    // let newWidths = this.state.widths;
    // let newMinWidths = this.state.minWidths;

    // if (JSON.stringify(Object.keys(this.state.columnsInfo)) !== JSON.stringify(Object.keys(defaults.columnsInfo))) {
    //   newTableWidth = maxTableWidth;
    //   newWidths = initialWidths;
    //   newMinWidths = minWidths;
    // }

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

    // console.log(newWidths);

    this.setState({
      columnsInfo: defaults.columnsInfo,

      orderedData: newOrderedData,
      data: newData,
      editableCells: defaults.editableCells,
    }, this.resizeTable);
  }

  componentDidUpdate() {
    this.props.onRender && this.props.onRender();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTable);
  }

  onSave = this.props.onSave || ((rowId, rowData, editableData) => {
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

  getDefaults(props) {
    const toReturn = {
      columnsInfo: props.columnsInfo,
      editableCells: props.editableCells,
    };
    const dataKeys = Object.keys(props.data);
    toReturn.columnsInfo = props.columnsInfo || dataKeys.reduce((total, objKey) => { return { ...total, [objKey]: { cellType: 'text', headerData: objKey } }; }, {});

    toReturn.editableCells = {};

    for (let i = 0; i < dataKeys.length; i++) {
      toReturn.editableCells[dataKeys[i]] = props.editableCells ? props.editableCells[dataKeys[i]] || [] : [];
    }

    return toReturn;
  }

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

  setActive = (id, col) => {
    this.setState({ activeCell: [id, col] });
  }

  removeListener = (e) => {
    e.stopPropagation();
    e.preventDefault();
    this.setState({ positionClicked: null });
    document.removeEventListener('pointermove', this.onMouseMove);
    document.removeEventListener('pointerup', this.removeListener);
  }

  validateSave = (cellText) => {
    let newInvalidCells = this.state.invalidCells;
    const editableRow = [...this.state.editableCells[this.state.activeCell[0]]];
    const updatedRow = { ...this.state.data[this.state.activeCell[0]] };
    updatedRow[this.state.activeCell[1]] = cellText;

    let objReturned = { updatedRow, editableRow };
    if (this.props.rowValidation) {
      objReturned = this.props.rowValidation(updatedRow, editableRow);
    }

    let hasErrors = false;

    for (const column in this.state.columnsInfo) {
      if (this.state.columnsInfo[column].rule) {
        if (!this.props.rules[this.state.columnsInfo[column].rule].validator(updatedRow[column])) {
          hasErrors = true;
          if (newInvalidCells.filter(el => el.id === this.state.activeCell[0] && el.col === column).length === 0) {
            newInvalidCells.push({ id: this.state.activeCell[0], col: column });
          }
        }
      }
    }

    if (hasErrors) {
      this.setState({
        data: {
          ...this.state.data,
          [this.state.activeCell[0]]: objReturned.updatedRow
        },
        editableCells: {
          ...this.state.editableCells,
          [this.state.activeCell[0]]: objReturned.editableRow
        },
        invalidCells: newInvalidCells,
        activeCell: [null, null]
      });
    } else {
      newInvalidCells = newInvalidCells.filter(obj => !(obj.id === this.state.activeCell[0] && obj.col === this.state.activeCell[1]));
      const activeRow = this.state.activeCell[0];
      this.setState({ invalidCells: newInvalidCells, activeCell: [null, null] }, (() => this.onSave(activeRow, objReturned.updatedRow, objReturned.editableRow)));
    }
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
    const windowWidth = ReactDOM.findDOMNode(this).parentNode.offsetWidth - 5;
    if (this.state.tableWidth !== windowWidth) {
      const scaleFactor = (windowWidth / this.state.tableWidth);
      const scaledWidths = Object.keys(this.state.widths).reduce((total, col) => { return { ...total, [col]: this.state.widths[col] * scaleFactor }; }, {});
      this.setState({ widths: scaledWidths, tableWidth: windowWidth });
    }
  }

  stopPr(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const style = this.props.style || {};
    return (
      <div>
      <table className={'table ' + (style.table || '')} ref={this.props.tableRef}>
        <thead>
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
              const headerStyle = { width: this.state.widths[colkey], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
              let type = null;
              if (col.headerType) {
                data = col.headerData;
                type = this.props.cellTypes[col.headerType];
                // headerStyle.width = this.state.widths[colkey] - 10;
              } else {
                headerStyle.width = Math.floor(this.state.widths[colkey]);
                data = { spans, title: col.headerData, sortData: () => { if (this.props.dataSort && this.props.dataSort[col.cellType]) { this.sortData(colkey, col.cellType); } }, };
                type = { display: <HeaderCellDisplay /> };
              }

              return (
                <th className={'table-header ' + (style.tableHeader || 'table-header-visuals')} key={colkey} style={{ width: this.state.widths[colkey] }}>
                  <Cell data={data} style={headerStyle} type={type} />
                  {!lastOne && <div style={{ touchAction: 'none', position: 'absolute', zIndex: 1, WebkitTransform: 'translate(7px)', transform: 'translateX(7px)', top: 0, right: 0, height: '100%', width: '15px', cursor: 'w-resize' }} onPointerDown={e => this.onMouseDown(e, colkey)} onPointerUp={this.stopPr} /> }
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {this.state.orderedData.map((entry) => {
            let column = null;
            if (entry === this.state.activeCell[0]) {
              column = this.state.activeCell[1];
            }
            return (
              <tr className={'table-row ' + (style.tableRow || 'table-row-visuals')} key={`tr${entry}`}>
                <Row
                  rowId={entry}
                  columnsInfo={this.props.columnsInfo}
                  activeColumn={column}
                  editableCells={this.state.editableCells[entry]}
                  invalidCells={this.state.invalidCells.filter(obj => obj.id === entry).map(el => el.col)}
                  rowData={this.state.data[entry]}
                  widths={this.state.widths}
                  wrap={this.props.wrap}
                  onSetActive={this.setActive}
                  cellTypes={this.props.cellTypes}
                  onValidateSave={this.validateSave}
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
