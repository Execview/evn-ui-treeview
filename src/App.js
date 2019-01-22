import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';
import './App.css';
import * as actionTypes from './store/actionTypes';
import { cellTypes } from './store/configs';


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
    // console.log(this.props.orderedData);
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
                    return (<th key={col.colName} onClick={() => this.props.onSort(col.colName, col.cellType)}><div className="thead-container">{col.colTitle}<span className="span-container"><span className="arrow-up" /> <span className="arrow-down" /></span></div></th>);
                  }
                  if (col.colName === this.props.column) {
                    return (
                      <th key={col.colName} onClick={() => this.props.onSort(col.colName, col.cellType)}>
                        <div className="thead-container">{col.colTitle}<span className="span-container"> <span className={col.colName === this.props.column ? (this.props.order === 'desc' ? 'arrow-down' : 'arrow-up') : ''} /> </span></div>
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
                    if (entry === this.props.activeCell[0] && col.colName === this.props.activeCell[1]) {
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
                        isEditable={false}
                        type={col.cellType}
                        col={col.colName}
                        key={col.colName + entry}
                        setActive={this.props.onSetActive}
                        isActive={isActive}
                        rule={col.rule}
                        onValidateSave={this.props.onValidateSave}
                        red={red}
                      />);
                  })}
                </tr>
              ))}
            </tbody>
          </table>) : ('')}
        { this.props.warning ? <p className="error-message">{this.props.rules[this.props.rule]}</p> : '' }
        <img style={{ marginTop: '150px', width: '400px' }} src="https://ichef.bbci.co.uk/images/ic/720x405/p0517py6.jpg" alt="xd" />
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
    rule: state.activeRule,
    column: state.column,
    order: state.order,
    cellText: state.cellText,
    invalidCells: state.invalidCells,
    orderedData: state.orderedData
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetData: () => dispatch({ type: actionTypes.GET_DATA }),
    onSort: (col, cellType) => dispatch({ type: actionTypes.SORT_DATA, col, cellType }),
    onSetActive: (id, col, rule, text) => dispatch({ type: actionTypes.SET_ACTIVE, id, col, rule, text }),
    onValidateSave: cellText => dispatch({ type: actionTypes.VALIDATE, cellText }),
    // onSetWarning: (warning, rule) => dispatch({ type: actionTypes.SET_WARNING, warning, rule })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
