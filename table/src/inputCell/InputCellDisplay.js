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
    const style = this.props.style || {};
    if (this.props.errorText !== null) {
      return (
        <div className="cell-container no-select cell-error" style={this.props.style}>
          <p className="cell-text-error" style={{ overflow: style.overflow, textOverflow: style.textOverflow, whiteSpace: style.whiteSpace }}>{this.props.data}</p>
          {this.props.errorText !== '' && <img className="error-icon" src={errorIcon} alt="info" onClick={e => this.showError(e)} />}
          <div className={'error-info ' + (this.state.showText ? 'error-shown' : 'error-hidden')}><p className="error-text">{this.props.errorText}</p></div>
        </div>
      );
    }
    return <div className="cell-container no-select" style={this.props.style}><p className="cell-text" style={{ overflow: style.overflow, textOverflow: style.textOverflow, whiteSpace: style.whiteSpace }}>{this.props.data}</p></div>;
  }
}

export default InputCellDisplay;
