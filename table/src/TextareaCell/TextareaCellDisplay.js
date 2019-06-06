import React, { Component } from 'react';
import errorIcon from '../resources/icons-info.svg';
import './TextareaCell.css';

class TextareaCellDisplay extends Component {
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
		const classes = this.props.classes || {};
    if (this.props.errorText !== null) {
      return (
        <div className={'textarea-cell-container no-select cell-error ' + (classes.container || '')} style={this.props.style}>
          <p className={'cell-text-error ' + (classes.textError || '')} style={{ overflow: style.overflow, textOverflow: style.textOverflow, whiteSpace: style.whiteSpace }}>{this.props.data}</p>
          {this.props.errorText !== '' && <img className="error-icon" src={errorIcon} alt="info" onClick={e => this.showError(e)} />}
          <div className={'error-info ' + (this.state.showText ? 'error-shown' : 'error-hidden')}><p className="error-text">{this.props.errorText}</p></div>
        </div>
      );
    }
    return <div className={'textarea-cell-container no-select ' + (classes.container || '')} style={this.props.style}><p className={'textarea-cell-text ' + (classes.text || '')} style={{ overflow: style.overflow, textOverflow: style.textOverflow, whiteSpace: style.whiteSpace }}>{this.props.data}</p></div>;
  }
}

export default TextareaCellDisplay;
