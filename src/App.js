import React, { Component } from 'react';
// import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
// import ColumnResizer from 'column-resizer';
import Cell from './Cell';
import './App.css';
import * as actionTypes from './store/actionTypes';
import { cellTypes } from './store/configs';
import { cats } from './store/constants';


class App extends Component {
  constructor(props) {
    super(props);
    const initialWidths = this.props.dataConfig.reduce((total, obj) => { return { ...total, [obj.colName]: 300 }; }, {});
    const minWidths = this.props.dataConfig.reduce((total, obj) => { return { ...total, [obj.colName]: 100 }; }, {});
    this.state = {
      wrap: true,
      widths: { ...initialWidths },
      minWidths,
      columnClicked: null,
      positionClicked: null,
      initialWidth: null,
      nextInitialWidth: null
    };
  }

  onMouseDown = (e, colName) => {
    e.stopPropagation();
    e.preventDefault();
    const nextCol = this.props.dataConfig[this.props.dataConfig.indexOf(this.props.dataConfig.filter(obj => obj.colName === colName)[0]) + 1].colName;
    console.log(nextCol);
    console.log('first width: ' + this.state.widths[colName] + ' 2nd width: ' + this.state.widths[nextCol]);
    this.setState({ positionClicked: e.clientX, columnClicked: colName, initialWidth: this.state.widths[colName], nextInitialWidth: this.state.widths[nextCol] });
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.removeListener);
  }

  onMouseMove = (e) => {
    e.stopPropagation();
    e.preventDefault();
    const currentX = e.clientX;
    const newVal = this.state.initialWidth + currentX - this.state.positionClicked;
    const nextCol = this.props.dataConfig[this.props.dataConfig.indexOf(this.props.dataConfig.filter(obj => obj.colName === this.state.columnClicked)[0]) + 1].colName;
    const nextVal = this.state.nextInitialWidth - currentX + this.state.positionClicked;
    if (newVal < this.state.minWidths[this.state.columnClicked] || nextVal < this.state.minWidths[nextCol]) {
      return;
    }
    this.setState({ widths: { ...this.state.widths, [this.state.columnClicked]: newVal, [nextCol]: nextVal } });
  }

  removeListener = (e) => {
    e.stopPropagation();
    e.preventDefault();
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.removeListener);
  }

  toggleWrap() {
    const wr = this.state.wrap;
    this.setState({ wrap: !wr });
  }

  stopPr(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  render() {
    const visible = this.props.orderedData.length > 0 ? { display: 'table' } : { display: 'none' };
    const randomNumber = Math.floor((Math.random() * 37));
    return (
      <div className="App">
        <div>
          <button className="get-data" type="button" onClick={() => this.props.onGetData()}>Get Data!</button>
          <button className="get-data" type="button" onClick={() => this.toggleWrap()}>Toggle Cell Wrap</button>
          {/* <button type="button" onClick={() => this.forceUpdate()}>RENDER</button> */}
        </div>
        <table style={visible}>
          <thead>
            <tr>
              {this.props.dataConfig.map((col, index) => {
                const lastOne = index === this.props.dataConfig.length - 1;
                const width = this.state.widths[col.colName];
                let spans = null;
                if (this.props.column === '') {
                  spans = (
                    <div className="span-container">
                      <span className="arrow-up" />
                      <span className="arrow-down" />
                    </div>);
                } else if (this.props.column === col.colName) {
                  spans = (
                    <div className="span-container">
                      <span className={col.colName === this.props.column ? (this.props.order === 'desc' ? 'arrow-down' : 'arrow-up') : ''} />
                    </div>
                  );
                }
                return (
                  <th key={col.colName} onMouseDown={() => this.props.onSort(col.colName, col.cellType)} title={col.colTitle} style={{ width: this.state.widths[col.colName], MozUserSelect: 'none', WebkitUserSelect: 'none', msUserSelect: 'none' }}>
                    {spans}
                    <div className="thead-container toggle-wrap" style={{ width: this.state.widths[col.colName] - 30 }}>{col.colTitle}</div>
                    {!lastOne && <div style={{ position: 'absolute', zIndex: 1, transform: 'translateX(5px)', top: 0, right: 0, height: '100%', width: '10px', cursor: 'w-resize' }} onMouseDown={e => this.onMouseDown(e, col.colName)} onClick={this.stopPr} /> }
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {this.props.orderedData.map(entry => (
              <tr key={`tr${entry}`}>
                {this.props.dataConfig.map((col, index) => {
                  let isActive = false;
                  if (entry === this.props.activeCell[0] && col.colName === this.props.activeCell[1] && this.props.editableCells[entry][col.colName]) {
                    isActive = true;
                  }
                  let red = false;
                  for (let i = 0; i < this.props.invalidCells.length; i++) {
                    if (entry === this.props.invalidCells[i].id && col.colName === this.props.invalidCells[i].col) {
                      red = true;
                    }
                  }
                  const onClickAction = isActive ? null : (() => this.props.onSetActive(entry, col.colName, col.rule, this.props.data[entry][col.colName] === undefined ? '' : this.props.data[entry][col.colName]));
                  const lastOne = index === this.props.dataConfig.length - 1;
                  let style = { width: this.state.widths[col.colName] - 5 };
                  if (this.state.wrap) {
                    style = { ...style, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' };
                  }
                  return (
                    <td
                      key={col.colName + entry + 1}
                      title={col.colName}
                      className={(isActive ? ' ' : 'table-label ') + (this.props.editableCells[entry][col.colName] ? '' : 'no-edit')}
                      onClick={onClickAction}
                    >
                        <Cell
                          style={style}
                          text={this.props.data[entry][col.colName] === undefined ? '' : this.props.data[entry][col.colName]}
                          type={cellTypes[col.cellType]}
                          key={col.colName + entry}
                          isActive={isActive}
                          onValidateSave={this.props.onValidateSave}
                          errorText={red ? this.props.rules[col.rule] : null}
                        />
                        {!lastOne && <div style={{ position: 'absolute', zIndex: 1, transform: 'translateX(5px)', top: 0, right: 0, height: '100%', width: '10px', cursor: 'w-resize' }} onMouseDown={e => this.onMouseDown(e, col.colName)} onClick={this.stopPr} /> }
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
        {/* <img style={{ marginTop: '30px', width: '400px', maxHeight: '400px' }} src={cats[randomNumber]} alt="xd" /> */}

      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    dataConfig: state.dataConfig,
    activeCell: state.activeCell,
    rules: state.rules,
    column: state.column,
    order: state.order,
    cellText: state.cellText,
    invalidCells: state.invalidCells,
    orderedData: state.orderedData,
    editableCells: state.editableCells,
    resizable: true,
    resizerOptions: {}
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetData: () => dispatch({ type: actionTypes.GET_DATA }),
    onSort: (col, cellType) => dispatch({ type: actionTypes.SORT_DATA, col, cellType }),
    onSetActive: (id, col, rule, text) => dispatch({ type: actionTypes.SET_ACTIVE, id, col, rule, text }),
    onValidateSave: cellText => dispatch({ type: actionTypes.VALIDATE, cellText }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
