import React, { Component } from 'react';
import { connect } from 'react-redux';
import TableWrapper from './tableWrapper/TableWrapper';
import './App.css';
import * as actionTypes from './store/actionTypes';
import { cellTypes, dataSort, rowValidation, rules, columnsInfo } from './store/configSwitch';
import cats from './store/ElCatso';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      display: true
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({ data: newProps.data });
  }

  onGetData() {
    this.setState({ display: !this.state.display });
  }

  render() {
    // const t1 = {};
    // for (let i = 0; i < 5; i++) {
    //   t1[Object.keys(this.state.data)[i]] = this.state.data[Object.keys(this.state.data)[i]];
    // }
    const dataKeys = Object.keys(this.state.data);
    const t2 = {};
    for (let i = 0; i < dataKeys.length; i++) {
      t2[dataKeys[i]] = this.state.data[dataKeys[i]];
    }
    const randomNumber = Math.floor((Math.random() * cats.length));
    return (
      <div className="App">
        <button className="get-data" type="button" onClick={() => this.onGetData()}>Toggle table!</button>
        {this.state.display && (
          <div>
            <TableWrapper
              columnsInfo={columnsInfo}
              editableCells={this.props.editableCells}
              data={t2}
              cellTypes={cellTypes}
              onSave={this.props.onSave}
              rules={rules}
              dataSort={dataSort}
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
