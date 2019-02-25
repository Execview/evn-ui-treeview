import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableWrapper from './TableWrapper';
import './App.css';
import * as actionTypes from './store/actionTypes';
import { cellTypes, dataSort, rowValidation, rules, columnsInfo2, columnsInfo3 } from './store/configs';
import { cats } from './store/constants';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      display: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ data: newProps.data });
  }

  onGetData() {
    this.setState({ display: true });
  }

  render() {
    const t1 = {};
    for (let i = 0; i < 5; i++) {
      t1[Object.keys(this.state.data)[i]] = this.state.data[Object.keys(this.state.data)[i]];
    }
    const t2 = {};
    for (let i = 4; i < Object.keys(this.state.data).length; i++) {
      t2[Object.keys(this.state.data)[i]] = this.state.data[Object.keys(this.state.data)[i]];
    }
    console.log(this.props.data);
    const randomNumber = Math.floor((Math.random() * 37));
    return (
      <div className="App">
        <button className="get-data" type="button" onClick={() => this.onGetData()}>Get Data!</button>
        {this.state.display && (
          <div>
            <TableWrapper
              columnsInfo={columnsInfo2}
              editableCells={this.props.editableCells}
              data={t1}
              cellTypes={cellTypes}
              onSave={this.props.onSave}
              rules={rules}
              dataSort={dataSort}
              rowValidation={rowValidation}
              tableWidth={1800}
            />
            <TableWrapper
              columnsInfo={columnsInfo3}
              editableCells={this.props.editableCells}
              data={t2}
              cellTypes={cellTypes}
              onSave={this.props.onSave}
              rules={rules}
              dataSort={dataSort}
              rowValidation={rowValidation}
              tableWidth={1200}
            />
          </div>
        )}
        <div style={{ margin: 'auto', marginTop: '30px', maxWidth: '400px' }}>
          <img style={{ marginTop: '30px', maxWidth: '100%' }} src={cats[randomNumber]} alt="xd" />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    data: state.data,
    editableCells: state.editableCells,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    // onGetData: () => dispatch({ type: actionTypes.GET_DATA }),
    onSave: (rowId, rowValues, editableValues) => dispatch({ type: actionTypes.SAVE, rowId, rowValues, editableValues }),
    onAddRow: () => dispatch({ type: actionTypes.ADD_ROW })
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
