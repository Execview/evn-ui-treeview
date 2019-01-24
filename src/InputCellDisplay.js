import React, { Component } from 'react';
import xd from './resources/icons-info.svg';

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
    if (this.props.hasError) {
      return (
        <div className="cell-container">
          <p className={'cell-text ' + (this.props.wrap ? 'toggle-wrap ' : ' ')}>{this.props.text}</p>
          <img className="error-icon" src={xd} alt="info" onClick={e => this.showError(e)} />
          <div className={'error-info ' + (this.state.showText ? 'error-shown' : 'error-hidden')}><p className="error-text">{this.props.errorText}</p></div>
        </div>
      );
    }
    return <div className="cell-container"><p className={'cell-text ' + (this.props.wrap ? 'toggle-wrap ' : ' ')}>{this.props.text}</p></div>;
  }
}

export default InputCellDisplay;
