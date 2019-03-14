import React, { PureComponent } from 'react';
import InputCellDisplay from '../inputCell/InputCellDisplay';
import InputCellEditor from '../inputCell/InputCellEditor';


export default class Cell extends PureComponent {
  render() {
    const data = this.props.data || '';
    const errorText = this.props.errorText || this.props.errorText === '' ? this.props.errorText : null;
    const style = this.props.style || {};
    const type = this.props.type || { display: <InputCellDisplay />, editor: <InputCellEditor /> };
    const onValidateSave = this.props.onValidateSave || (() => { console.log('cell needs onValidateSave brah'); });
    if (this.props.isActive) {
      return (
        React.createElement(type.editor.type, { ...type.editor.props, data, onValidateSave, errorText, style }));
    }
    return (
      React.createElement(type.display.type, { ...type.display.props, data, onValidateSave, errorText, style }));
  }
}
