import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';
import './App.css';
import * as actionTypes from './store/actionTypes';
import { cellTypes } from './store/configs';
import { cats } from './store/constants';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wrap: true
    };
  }

  toggleWrap() {
    const wr = this.state.wrap;
    this.setState({ wrap: !wr });
  }

  render() {
    const randomNumber = Math.floor((Math.random() * 37));
    return (
      <div className="App">
        <div>
          <button className="get-data" type="button" onClick={() => this.props.onGetData()}>Get Data!</button>
          <button className="get-data" type="button" onClick={() => this.toggleWrap()}>Toggle Cell Wrap</button>
          {/* <button type="button" onClick={() => this.forceUpdate()}>RENDER</button> */}
        </div>
        {this.props.orderedData.length > 0 ? (
          <table>
            <tbody>
              <tr>
                {this.props.dataConfig.map((col) => {
                  if (this.props.column === '') {
                    return (<th key={col.colName} onClick={() => this.props.onSort(col.colName, col.cellType)}><span className="span-container"><span className="arrow-up" /> <span className="arrow-down" /></span><div className="thead-container">{col.colTitle}</div></th>);
                  }
                  if (col.colName === this.props.column) {
                    return (
                      <th key={col.colName} onClick={() => this.props.onSort(col.colName, col.cellType)}>
                        <span className="span-container"> <span className={col.colName === this.props.column ? (this.props.order === 'desc' ? 'arrow-down' : 'arrow-up') : ''} /> </span><div className="thead-container">{col.colTitle}</div>
                      </th>
                    );
                  }
                  return (<th key={col.colName} onClick={() => this.props.onSort(col.colName, col.cellType)}><div className="thead-container">{col.colTitle}</div></th>);
                })}
              </tr>
            </tbody>
            <tbody>
              {this.props.orderedData.map(entry => (
                <tr key={`tr${entry}`}>
                  {this.props.dataConfig.map((col) => {
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
                    return (
                      <Cell
                        cellTypes={cellTypes}
                        wrap={this.state.wrap ? 'toggle-wrap' : ''}
                        text={this.props.data[entry][col.colName] === undefined ? '' : this.props.data[entry][col.colName]}
                        entry={entry}
                        isEditable={this.props.editableCells[entry][col.colName]}
                        type={col.cellType}
                        col={col.colName}
                        key={col.colName + entry}
                        setActive={this.props.onSetActive}
                        isActive={isActive}
                        rule={col.rule}
                        onValidateSave={this.props.onValidateSave}
                        hasError={red}
                        errorText={this.props.rules[col.rule]}
                      />);
                  })}
                </tr>
              ))}
            </tbody>
          </table>) : ('')}
        <img style={{ marginTop: '30px', width: '400px', maxHeight: '400px' }} src={cats[randomNumber]} alt="xd" />
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
    editableCells: state.editableCells
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetData: () => dispatch({ type: actionTypes.GET_DATA }),
    onSort: (col, cellType) => dispatch({ type: actionTypes.SORT_DATA, col, cellType }),
    onSetActive: (id, col, rule, text) => dispatch({ type: actionTypes.SET_ACTIVE, id, col, rule, text }),
    onValidateSave: (cellText, rule) => dispatch({ type: actionTypes.VALIDATE, cellText, rule }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
