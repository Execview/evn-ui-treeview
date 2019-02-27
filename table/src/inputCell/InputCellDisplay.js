import React, { Component } from 'react';
import errorIcon from '../resources/icons-info.svg';
import './InputCell.css';

class InputCellDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = { showText: false };
  }

  showError = (e) => {
    e.stopPropagation();
    this.setState({ showText: true });
    setTimeout(() => {
      this.setState({ showText: false });
    }, 3000);
  };


  render() {
    if (this.props.errorText !== null) {
      return (
        <div className="cell-container cell-error">
          <p style={this.props.style} className="cell-text-error">{this.props.data}</p>
          {this.props.errorText !== '' && <img className="error-icon" src={errorIcon} alt="info" onClick={e => this.showError(e)} />}
          <div className={'error-info ' + (this.state.showText ? 'error-shown' : 'error-hidden')}><p className="error-text">{this.props.errorText}</p></div>
        </div>
      );
    }
    return <div className="cell-container"><p style={this.props.style} className="cell-text">{this.props.data}</p></div>;
  }
}

export default InputCellDisplay;
