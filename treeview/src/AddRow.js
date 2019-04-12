import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionTypes';


class AddRow extends Component {

  addRow = () => {
  }

  render() {
    return (
      <div className="button-container">
        <button className="get-data" type="button" onClick={() => this.props.onAddRow(Object.keys(this.props.columnsInfo))}>Add Row</button>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
	return {
        onAddRow: (columns) => dispatch({ type: actionTypes.ADD_ROW, columns })
	}
}

export default connect(null, mapDispatchToProps)(AddRow);