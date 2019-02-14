import React, { Component } from 'react';
import { connect } from 'react-redux';
import Table from './Table';
import './App.css';
import * as actionTypes from './store/actionTypes';
import { cellTypes, dataSort, rowValidation, rules, validators, columnsInfo } from './store/configs';
import { cats } from './store/constants';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      wrap: true,
    };
  }

  toggleWrap() {
    const wr = this.state.wrap;
    this.setState({ wrap: !wr });
  }

  render() {
    // console.log(this.props.orderedData);
    const randomNumber = Math.floor((Math.random() * 37));
    return (
      <div className="App">
        <div>
          <button className="get-data" type="button" onClick={() => this.props.onGetData()}>Get Data!</button>
          <button className="get-data" type="button" onClick={() => this.toggleWrap()}>Toggle Cell Wrap</button>
          <button className="get-data" type="button" onClick={this.props.onAddRow}>Add Row</button>
          {/* <button type="button" onClick={() => this.forceUpdate()}>RENDER</button> */}
        </div>
        <Table
          columnsInfo={columnsInfo}
          orderedData={this.props.orderedData}
          editableCells={this.props.editableCells}
          data={this.props.data}
          wrap={this.state.wrap}
          cellTypes={cellTypes}
          onSave={this.props.onSave}
          rules={rules}
          dataSort={dataSort}
          rowValidation={rowValidation}
          validators={validators}
        />
        <img style={{ marginTop: '30px', width: '400px', maxHeight: '400px' }} src={cats[randomNumber]} alt="xd" />
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    columnsInfo: state.columnsInfo,
    orderedData: state.orderedData,
    editableCells: state.editableCells,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onGetData: () => dispatch({ type: actionTypes.GET_DATA }),
    onSave: (rowId, rowDetails) => dispatch({ type: actionTypes.SAVE, rowId, rowDetails }),
    onAddRow: () => dispatch({ type: actionTypes.ADD_ROW })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
