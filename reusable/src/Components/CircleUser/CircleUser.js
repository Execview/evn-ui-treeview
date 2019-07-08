import React from 'react';
import './CircleUser.css';

const CircleUser = (props) => {
  const minHeight = props.size || 40
  return (
    <div className={"user-circle " + props.className} style={{height: minHeight-4, width: minHeight-4}}>
      <img className="user-image" src={props.url} alt="xd" />
    </div>
  );
}

export default CircleUser