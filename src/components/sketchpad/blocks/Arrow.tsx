import React ,{Component} from 'react';
import {ArrowInstance} from "../../../store/BlocksStore";

function Arrow(props: ArrowInstance) {
  const {id, path1, path2, left, top} = props;

  return (
    <div className="arrowblock" style={{ left: left, top: top }} >
      <input type="hidden" className="arrowid" value={id}/>
      <svg preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d={path1} stroke="#C5CCD0" strokeWidth="2px"/>
        <path d={path2} fill="#C5CCD0"/>
      </svg>
    </div>
  );
}

export default Arrow;