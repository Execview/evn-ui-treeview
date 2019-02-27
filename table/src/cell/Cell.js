import React, { PureComponent } from 'react';


export default class Cell extends PureComponent {
  render() {
    const data = this.props.data || '';
    const errorText = this.props.errorText || this.props.errorText === '' ? this.props.errorText : null;
    const style = this.props.style || {};
    const onValidateSave = this.props.onValidateSave || (() => { console.log('cell needs onValidateSave brah'); });
    if (this.props.isActive) {
      return (
        React.cloneElement(this.props.type.editor, { data, onValidateSave }));
    }
    return (
      React.cloneElement(this.props.type.display, { data, errorText, style }));
  }
}