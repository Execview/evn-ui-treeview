import React, { useState } from 'react';
import './TextareaCell.css';

const TextareaCellEditor = (props) => {
  const [text, setText] = useState(props.data || '');

  const onChange = (value) => {
    setText(value);
  };

  const onKeyPress = (e) => {
    if (e.key === 'Enter' && !(e.shiftKey)) {
      props.onValidateSave(text);
    }
  };

  const classes = props.classes || {};
  return (
    <div className={'text-container ' + (classes.container || '')} style={props.style}>
      <textarea rows="1" autoFocus onBlur={() => props.onValidateSave(text)} className={'text-input ' + (classes.text || '')} type="text" value={text} onChange={e => onChange(e.target.value)} onKeyPress={e => onKeyPress(e)} />

    </div>
  );
};

export default TextareaCellEditor;
