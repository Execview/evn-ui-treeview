import React, { Component } from 'react';
import Row from './Row';
import './Table.css';

export default class Table extends Component {
  constructor(props) {
    super(props);
    const defaults = this.getDefaults(props);

    const maxTableWidth = defaults.maxTableWidth;
    const initWidth = maxTableWidth / Object.keys(defaults.columnsInfo).length;
    const initialWidths = Object.keys(defaults.columnsInfo).reduce((total, key) => { return { ...total, [key]: initWidth }; }, {});
    const minWidths = Object.keys(defaults.columnsInfo).reduce((total, key) => { return { ...total, [key]: 100 }; }, {});
    this.state = {
      columnsInfo: defaults.columnsInfo,
      dataSort: defaults.dataSort,
      maxTableWidth,
      tableWidth: maxTableWidth,
      widths: { ...initialWidths },
      minWidths: { ...minWidths },
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
  }

  componentWillReceiveProps(newProps) {
    const defaults = this.getDefaults(newProps);

    const maxTableWidth = defaults.maxTableWidth;
    const initWidth = maxTableWidth / Object.keys(defaults.columnsInfo).length;
    const initialWidths = Object.keys(defaults.columnsInfo).reduce((total, key) => { return { ...total, [key]: initWidth }; }, {});
    const minWidths = Object.keys(defaults.columnsInfo).reduce((total, key) => { return { ...total, [key]: 100 }; }, {});

    let newTableWidth = this.state.tableWidth;
    let newWidths = this.state.widths;
    let newMinWidths = this.state.minWidths;

    if (JSON.stringify(Object.keys(this.state.columnsInfo)) !== JSON.stringify(Object.keys(defaults.columnsInfo))) {
      newTableWidth = maxTableWidth;
      newWidths = initialWidths;
      newMinWidths = minWidths;
    }

    const keys = Object.keys(newProps.data);

    const alreadyOrderedData = this.state.orderedData.filter(el => keys.includes(el));
    const dataToAdd = keys.filter(el => !this.state.orderedData.includes(el));

    const newOrderedData = alreadyOrderedData.concat(dataToAdd);

    this.setState({
      columnsInfo: defaults.columnsInfo,
      dataSort: defaults.dataSort,
      maxTableWidth,
      tableWidth: newTableWidth,
      widths: { ...newWidths },
      minWidths: { ...newMinWidths },
      orderedData: newOrderedData,
      data: newProps.data,
      editableCells: defaults.editableCells
    }, this.resizeTable);
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
      dataSort: props.dataSort
    };

    toReturn.columnsInfo = props.columnsInfo || Object.keys(props.data).reduce((total, objKey) => { return { ...total, [objKey]: { cellType: 'text', colTitle: objKey } }; }, {});

    toReturn.editableCells = {};
    for (let i = 0; i < Object.keys(props.data).length; i++) {
      toReturn.editableCells[Object.keys(props.data)[i]] = props.editableCells ? props.editableCells[Object.keys(props.data)[i]] || [] : [];
    }

    if (!props.dataSort) {
      toReturn.dataSort = {};
      toReturn.dataSort.text = (a, b) => {
        const x = a ? a.toLowerCase() : '';
        const y = b ? b.toLowerCase() : '';
        return (x > y) ? -1 : ((x < y) ? 1 : 0);
      };
    }
    toReturn.maxTableWidth = props.tableWidth || 1800;
    return toReturn;
  }

  onMouseDown = (e, colName) => {
    e.stopPropagation();
    e.preventDefault();
    console.log(this.state.widths[colName])
    const nextCol = Object.keys(this.state.columnsInfo)[Object.keys(this.state.columnsInfo).indexOf(colName) + 1];
    console.log(this.state.widths[nextCol]);
    // console.log('first width: ' + this.state.widths[colName] + ' 2nd width: ' + this.state.widths[nextCol]);
    this.setState({ positionClicked: e.clientX, columnClicked: colName, initialWidth: this.state.widths[colName], nextInitialWidth: this.state.widths[nextCol] });
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.removeListener);
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
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.removeListener);
  }

  validateSave = (cellText) => {
    console.log('trigger mouse down');
    // console.log(action.cellText);

    const columnConfig = this.state.columnsInfo[this.state.activeCell[1]];

    let newInvalidCells = JSON.parse(JSON.stringify(this.state.invalidCells));
    const editableRow = [...this.state.editableCells[this.state.activeCell[0]]];
    const updatedRow = { ...this.state.data[this.state.activeCell[0]] };
    updatedRow[this.state.activeCell[1]] = cellText;

    let objReturned = { updatedRow, editableRow };
    if (this.props.rowValidation) {
      objReturned = this.props.rowValidation(updatedRow, editableRow);
    }

    if (columnConfig.rule !== undefined) {
      if (this.props.rules[columnConfig.rule].validator(cellText)) {
        newInvalidCells = newInvalidCells.filter(obj => !(obj.id === this.state.activeCell[0] && obj.col === this.state.activeCell[1]));
        this.onSave(this.state.activeCell[0], objReturned.updatedRow, objReturned.editableRow);
      } else {
        newInvalidCells.push({ id: this.state.activeCell[0], col: this.state.activeCell[1] });
        this.setState({
          data: {
            ...this.state.data,
            [this.state.activeCell[0]]: objReturned.updatedRow
          },
          editableCells: {
            ...this.state.editableCells,
            [this.state.activeCell[0]]: objReturned.editableRow
          }
        });
      }
    } else {
      this.onSave(this.state.activeCell[0], objReturned.updatedRow, objReturned.editableRow);
    }
    this.setState({ activeCell: [null, null], invalidCells: newInvalidCells });
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
    if (this.state.dataSort[cellType]) {
      dataToOrder.sort((a, b) => {
        return this.state.dataSort[cellType](a.val, b.val);
      });
      if (ordering === 'asc') {
        dataToOrder.reverse();
      }
    }


    const dataToReturn = dataToOrder.map(obj => obj.id);

    this.setState({
      orderedData: dataToReturn,
      order: ordering,
      column: columnToOrder,
      // activeCell: [null, null],
    });
    // this.props.updateOrderedData(dataToReturn);
  }

  resizeTable() {
    // console.log('fire resize on ' + window.innerWidth + ' width');
    const windowWidth = document.body.offsetWidth - 5 > this.state.maxTableWidth ? this.state.maxTableWidth : document.body.offsetWidth - 17;
    const toRet = Object.keys(this.state.widths).map(colName => this.state.widths[colName] * 100 / this.state.tableWidth);
    const newScale = toRet.map(wdt => wdt * windowWidth / 100);
    const keys = Object.keys(this.state.widths);
    const newCopy = JSON.parse(JSON.stringify(this.state.widths));
    for (let i = 0; i < keys.length; i++) {
      newCopy[keys[i]] = newScale[i];
    }
    this.setState({ widths: newCopy, tableWidth: windowWidth });
  }

  stopPr(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    // console.log(this.state.orderedData);
    const style = { maxWidth: this.state.tableWidth, margin: 'auto' };
    if (this.state.tableWidth < this.state.maxTableWidth) {
      style.margin = 0;
    }

    return (
      <div style={style}>
        <table>
          <thead>
            <tr>
              {Object.keys(this.state.columnsInfo).map((colkey, index) => {
                const col = this.state.columnsInfo[colkey];
                const lastOne = index === Object.keys(this.state.columnsInfo).length - 1;
                let spans = null;
                if (this.state.column === '') {
                  spans = (
                    <div className="span-container">
                      <span className="arrow-up" />
                      <span className="arrow-down" />
                    </div>);
                } else if (this.state.column === colkey) {
                  spans = (
                    <div className="span-container">
                      <span className={colkey === this.state.column ? (this.state.order === 'desc' ? 'arrow-down' : 'arrow-up') : ''} />
                    </div>
                  );
                }
                return (
                  <th key={colkey} onMouseDown={() => this.sortData(colkey, col.cellType)} title={col.colTitle} style={{ width: this.state.widths[colkey], MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}>
                    {spans}
                    <div className="thead-container toggle-wrap" style={{ width: this.state.widths[colkey] - 30 }}>{col.colTitle}</div>
                    {!lastOne && <div style={{ position: 'absolute', zIndex: 1, transform: 'translateX(7px)', top: 0, right: 0, height: '100%', width: '15px', cursor: 'w-resize' }} onMouseDown={e => this.onMouseDown(e, colkey)} onClick={this.stopPr} /> }
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
              // const colTitles = {};
              // for (let i = 0; i < this.state.columnsInfo.length; i++) {
              //   colTitles[this.state.columnsInfo[i].colName] = this.state.columnsInfo[i].colTitle;
              // }
              return (
                <tr key={`tr${entry}`}>
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
