import React, { Component } from 'react';
import { CircleUser } from '@execview/reusable';
import classes from './ImageDisplay.module.css';

const ImageDisplay = (props) => {
  let circlesLimit = props.data.length;
  let addAmount = null;
  if (props.style.width - 10 < (props.data.length + 1) * 20) {
    circlesLimit = parseInt((props.style.width - 50) / 20, 10);
    addAmount = <div className="add-container" style={{ left: ((circlesLimit + 1) * 20) + 1 }}>{'+' + (props.data.length - circlesLimit)}</div>;
  }
  return (
    <div className="user-cell">
      <div className="users-container">
        {props.data && props.data.slice(0, circlesLimit).map((image, index) => {
          return (
            <div className="user-profile" key={'circle' + (index + 1)} style={{ zIndex: props.data.length - index, left: 20 * index }}>
              <CircleUser url={image} />
            </div>
          );
        })}
        {addAmount}
      </div>
    </div>
  );
};

export default ImageDisplay;
