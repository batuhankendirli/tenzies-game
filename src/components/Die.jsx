import React from 'react';

export default function Die(props) {
  const style = props.isHeld ? { backgroundColor: '#59E391' } : {};
  return (
    <div
      className={`die-square dice--${props.number}`}
      style={style}
      onClick={props.hold}
    >
      {/* {props.number} */}
    </div>
  );
}
