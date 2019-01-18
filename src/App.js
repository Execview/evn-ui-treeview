import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cell from './Cell';
import './App.css';
import * as actionTypes from './store/actionTypes';


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
    return (
      <div className="App">
        <div>
          <button className="get-data" type="button" onClick={() => this.props.onGetData()}>Get Data!</button>
          <button className="get-data" type="button" onClick={() => this.toggleWrap()}>Toggle Cell Wrap</button>
          {/* <button type="button" onClick={() => this.forceUpdate()}>RENDER</button> */}
        </div>
        {this.props.data.length > 0 ? (
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
              {this.props.data.map((row, index) => (
                <tr key={`tr${index + 1}`}>
                  {this.props.dataConfig.map((col) => {
                    if (index === this.props.activeCell[0] && col.colName === this.props.activeCell[1]) {
                      return (<Cell cellText={this.props.cellText} warning={this.props.warning} onInputChange={this.props.onInputChange} onSaveCell={this.props.onSaveCell} onKeyPress={this.props.onKeyPress} isActive={true} activeCell={this.props.activeCell} key={col.colName + row.id} type={col.cellType} />);
                    }
                    return (<Cell class={this.state.wrap ? 'toggle-wrap' : ''} text={row[col.colName] === undefined ? '' : row[col.colName]} row={index} labelType={col.labelType} col={col.colName} key={col.colName + row.id} setActive={this.props.onSetActive} isActive={false} rule={col.rule} />);
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
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetData: () => dispatch({ type: actionTypes.GET_DATA }),
    onSort: (col, cellType) => dispatch({ type: actionTypes.SORT_DATA, col, cellType }),
    onSetActive: (row, col, rule, text) => dispatch({ type: actionTypes.SET_ACTIVE, row, col, rule, text }),
    onInputChange: text => dispatch({ type: actionTypes.CHANGE_CELL_TEXT, text }),
    onKeyPress: key => dispatch({ type: actionTypes.KEY_PRESSED, key }),
    onSaveCell: (row, col, text) => dispatch({ type: actionTypes.SAVE_CELL, row, col, text })
    // onSetWarning: (warning, rule) => dispatch({ type: actionTypes.SET_WARNING, warning, rule })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
