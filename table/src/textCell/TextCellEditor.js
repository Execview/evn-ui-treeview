import React, { useState } from 'react';
import './TextCell.css';

 const TextCellEditor = (props) => {

	const [text, setText] = useState(props.data)

 	const onChange = (value) => {
    setText(value);
  }

  	const onKeyPress = (e) => {
    if (e.key === 'Enter') {
      props.onValidateSave(text);
    }
  }


	const classes = props.classes || {};
    return (
      <div className={'text-container ' + (classes.container || '')} style={props.style}>
        <input className={'number-input ' + (classes.text || '')} onBlur={() => props.onValidateSave(text)} autoFocus type="text" value={text} onChange={e => onChange(e.target.value)} onKeyPress={e => onKeyPress(e)} />
      </div>
    );
}

export default TextCellEditor
