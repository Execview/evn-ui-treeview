import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';
import './App.css';
import * as actionTypes from './store/actionTypes';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    return (
      <div className="App">
        <div>
          <button className="get-data" type="button" onClick={() => this.props.onGetData()}>Get Data!</button>
          {/* <button type="button" onClick={() => this.forceUpdate()}>RENDER</button> */}
        </div>
        {this.props.data.length > 0 ? (
          <table>
            <tbody>
              <tr>
                {this.props.dataConfig.map(col => (
                  <th key={col.colName} onClick={() => this.props.onSort(col.colName, col.cellType)}>{col.colTitle}</th>
                ))}
              </tr>
            </tbody>
            <tbody>
              {this.props.data.map((row, index) => (
                <tr key={`tr${index + 1}`}>
                  {this.props.dataConfig.map((col) => {
                    if (index === this.props.activeCell[0] && col.colName === this.props.activeCell[1]) {
                      return (<Cell text={row[col.colName]} row={index} col={col.colName} key={col.colName + row.id} type={col.cellType} isActive={false} setActive={this.props.onSetActive} rule={col.rule} />);
                    }
                    return (<Cell text={row[col.colName]} row={index} col={col.colName} key={col.colName + row.id} type={col.cellType} isActive={true} setActive={this.props.onSetActive} rule={col.rule} />);
                  })}
                </tr>
              ))}
            </tbody>
          </table>) : ('')}
        { this.props.warning ? <p className="error-message">{this.props.rules[this.props.rule]}</p> : '' }
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
    warning: state.warning,
    rule: state.activeRule
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetData: () => dispatch({ type: actionTypes.GET_DATA }),
    onSort: (col, cellType) => dispatch({ type: actionTypes.SORT_DATA, col, cellType }),
    onSetActive: (row, col, rule, text) => dispatch({ type: actionTypes.SET_ACTIVE, row, col, rule, text }),
    // onSetWarning: (warning, rule) => dispatch({ type: actionTypes.SET_WARNING, warning, rule })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
