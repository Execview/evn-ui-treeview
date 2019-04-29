import React, { Component } from 'react';
import Table from '../table/Table';
import './TableWrapper.css';

const crypto = require('crypto');

const hash = crypto.createHash('sha256');

export default class TableWrapper extends Component {
  tableWidth = this.props.tableWidth;

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

  addRow() {
    const newId = '_' + hash.update(Date.now() + Math.random().toString()).digest('hex').substring(0, 5);
    this.props.onSave(newId, {}, Object.keys(this.props.columnsInfo));
    // this.props.onSave(newId, {}, { company: true, contact: true, country: true, value: true, progress: true, dueDate: true });
  }


  render() {
    return (
      <div style={{ width: '100%' }}>
        <div className="button-wrapper">
          <button className="get-data" type="button" onClick={() => this.toggleWrap()}>Toggle Cell Wrap</button>
          <button className="get-data" type="button" onClick={() => this.addRow()}>Add Row</button>
          <button className="get-data" type="button" onClick={() => { this.tableWidth = 500; this.forceUpdate(); }}>change width</button>
          {/* <button type="button" onClick={() => this.forceUpdate()}>RENDER</button> */}
        </div>
        <Table
          columnsInfo={this.props.columnsInfo}
          editableCells={this.props.editableCells}
          data={this.props.data}
          wrap={this.state.wrap}
          cellTypes={this.props.cellTypes}
          onSave={this.props.onSave}
          rules={this.props.rules}
          dataSort={this.props.dataSort}
          tableWidth={this.tableWidth}
        />
      </div>
    );
  }
}

//
// <Table
//   columnsInfo={this.props.columnsInfo}
//   orderedData={this.state.orderedData}
//   editableCells={this.props.editableCells}
//   data={this.props.data}
//   wrap={this.state.wrap}
//   cellTypes={this.props.cellTypes}
//   onSave={this.props.onSave}
//   rules={this.props.rules}
//   dataSort={this.props.dataSort}
//   rowValidation={this.props.rowValidation}
//   validators={this.props.validators}
//   tableWidth={this.props.tableWidth}
// />
