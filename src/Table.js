import React, { Component } from 'react';
import Row from './Row';

export default class Table extends Component {
  constructor(props) {
    super(props);
    const initialWidths = props.columnsInfo.reduce((total, obj) => { return { ...total, [obj.colName]: 300 }; }, {});
    const minWidths = props.columnsInfo.reduce((total, obj) => { return { ...total, [obj.colName]: 100 }; }, {});
    this.state = {
      tableWidth: 1800,
      widths: { ...initialWidths },
      minWidths,
      columnClicked: null,
      positionClicked: null,
      initialWidth: null,
      nextInitialWidth: null,
      column: '',
      order: 'desc',
      orderedData: props.orderedData,
      activeCell: [null, null],
      invalidCells: [],
    };
    this.resizeTable = this.resizeTable.bind(this);
  }

  componentDidMount() {
    this.resizeTable();
    window.addEventListener('resize', this.resizeTable);
  }

  componentWillReceiveProps(newProps) {
    if (this.props.orderedData !== newProps.orderedData) {
      this.setState({ orderedData: newProps.orderedData });
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeTable);
  }

  onMouseDown = (e, colName) => {
    e.stopPropagation();
    e.preventDefault();
    const nextCol = this.props.columnsInfo[this.props.columnsInfo.indexOf(this.props.columnsInfo.filter(obj => obj.colName === colName)[0]) + 1].colName;
    // console.log(nextCol);
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
    const nextCol = this.props.columnsInfo[this.props.columnsInfo.indexOf(this.props.columnsInfo.filter(obj => obj.colName === this.state.columnClicked)[0]) + 1].colName;
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
    // console.log('trigger mouse down');
    // console.log(action.cellText);
    const columnConfig = this.props.columnsInfo.filter(obj => obj.colName === this.state.activeCell[1]);

    let newInvalidCells = JSON.parse(JSON.stringify(this.state.invalidCells));
    const editableRow = { ...this.props.editableCells[this.state.activeCell[0]] };
    const updatedRow = { ...this.props.data[this.state.activeCell[0]] };
    updatedRow[this.state.activeCell[1]] = cellText;

    const objReturned = this.props.rowValidation(updatedRow, editableRow);


    if (columnConfig[0].rule !== undefined) {
      if (this.props.validators[columnConfig[0].rule](cellText)) {
        newInvalidCells = newInvalidCells.filter(obj => !(obj.id === this.state.activeCell[0] && obj.col === this.state.activeCell[1]));
      } else {
        newInvalidCells.push({ id: this.state.activeCell[0], col: this.state.activeCell[1] });
      }
    }
    this.props.onSave(this.state.activeCell[0], objReturned);
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
    const dataToOrder = this.state.orderedData.map((key) => { return ({ id: key, val: this.props.data[key][col] }); });
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
      // activeCell: [null, null],
    });
  }

  resizeTable() {
    // console.log('fire resize on ' + window.innerWidth + ' width');
    const windowWidth = window.innerWidth > 1800 ? 1780 : window.innerWidth - 30;
    if (windowWidth !== this.state.tableWidth) {
      const toRet = Object.keys(this.state.widths).map(colName => this.state.widths[colName] * 100 / this.state.tableWidth);
      const newScale = toRet.map(wdt => wdt * windowWidth / 100);
      const keys = Object.keys(this.state.widths);
      const newCopy = JSON.parse(JSON.stringify(this.state.widths));
      for (let i = 0; i < keys.length; i++) {
        newCopy[keys[i]] = newScale[i];
      }
      this.setState({ widths: newCopy, tableWidth: windowWidth });
    }
  }

  stopPr(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    // console.log(this.state.orderedData);
    // console.log(this.state.orderedData);
    const visible = this.state.orderedData.length > 0 ? { display: 'table' } : { display: 'none' };
    return (
      <table style={visible}>
        <thead>
          <tr>
            {this.props.columnsInfo.map((col, index) => {
              const lastOne = index === this.props.columnsInfo.length - 1;
              let spans = null;
              if (this.state.column === '') {
                spans = (
                  <div className="span-container">
                    <span className="arrow-up" />
                    <span className="arrow-down" />
                  </div>);
              } else if (this.state.column === col.colName) {
                spans = (
                  <div className="span-container">
                    <span className={col.colName === this.state.column ? (this.state.order === 'desc' ? 'arrow-down' : 'arrow-up') : ''} />
                  </div>
                );
              }
              return (
                <th key={col.colName} onMouseDown={() => this.sortData(col.colName, col.cellType)} title={col.colTitle} style={{ width: this.state.widths[col.colName], MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}>
                  {spans}
                  <div className="thead-container toggle-wrap" style={{ width: this.state.widths[col.colName] - 30 }}>{col.colTitle}</div>
                  {!lastOne && <div style={{ position: 'absolute', zIndex: 1, transform: 'translateX(7px)', top: 0, right: 0, height: '100%', width: '15px', cursor: 'w-resize' }} onMouseDown={e => this.onMouseDown(e, col.colName)} onClick={this.stopPr} /> }
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {this.state.orderedData.map(entry => (
            <tr key={`tr${entry}`}>
              <Row
                rowId={entry}
                columnsInfo={this.props.columnsInfo}
                activeCell={this.state.activeCell}
                editableCells={this.props.editableCells[entry]}
                invalidCells={this.state.invalidCells.filter(obj => obj.id === entry)}
                rowData={this.props.data[entry]}
                widths={this.state.widths}
                wrap={this.props.wrap}
                onSetActive={this.setActive}
                cellTypes={this.props.cellTypes}
                onValidateSave={this.validateSave}
                rules={this.props.rules}
                onMouseDown={this.onMouseDown}
              />
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}
