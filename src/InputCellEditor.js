import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as actionTypes from './store/actionTypes';

class InputCellEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }


  render() {
    if (this.props.warning) {
      return (<textarea rows="1" cols="50" className="text-input red" type="text" value={this.props.text} onChange={e => this.props.onInputChange(e.target.value)} onKeyPress={e => this.props.onKeyPress(e)} />);
    }
    return (
      <textarea rows="1" cols="50" className="text-input" type="text" value={this.props.text} onChange={e => this.props.onInputChange(e.target.value)} onKeyPress={e => this.props.onKeyPress(e)} />
    );
  }
}

const mapStateToProps = (state) => {
  return {
    text: state.cellText,
    warning: state.warning
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    onInputChange: text => dispatch({ type: actionTypes.CHANGE_CELL_TEXT, text }),
    onKeyPress: key => dispatch({ type: actionTypes.KEY_PRESSED, key })
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(InputCellEditor);
