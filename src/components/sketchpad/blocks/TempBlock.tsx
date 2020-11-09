import React, {Component, useEffect} from 'react';

import eye from "../../../assets/images/eye.svg";
import action from "../../../assets/images/action.svg";
import time from "../../../assets/images/time.svg";
import error from "../../../assets/images/error.svg";

const tempBlocks = [
  {
    icon: eye,
    title: 'Enter Workflow',
    desc: 'Triggers when somebody visits a specified page'
  },
  {
    icon: action,
    title: 'Event occurred',
    desc: 'Triggers when somebody performs a specified action'
  },
  {
    icon: time,
    title: 'Time has passed',
    desc: 'Triggers after a specified amount of time'
  },
  {
    icon: error,
    title: 'Exit Workflow',
    desc: 'Triggers when a specified error happens'
  },
  {
    icon: action,
    title: 'Push Action',
    desc: 'Push notification based on the action definition'
  },
  {
    icon: action,
    title: 'SMS Action',
    desc: 'SMS Messages will be sent out based on the action definition'
  },
  {
    icon: action,
    title: 'E-mail Action',
    desc: 'Email Communication will be sent out based on the action definition'
  },
  {
    icon: action,
    title: 'Web Api Action',
    desc: 'Web Api will be sent out based on the action definition'
  },
];

type TempProps = {
  left: number;
  top: number;
  type: number;
  id: number;
  blocksTemp: Array<any>;
  arrowsTemp: Array<any>;
  setTempRef: (temp:any) => void;
}


function TempBlock(props: TempProps) {
  let tempRef: any = React.createRef<HTMLDivElement>();
  const { setTempRef, id } = props;
  const { left, top, type, blocksTemp, arrowsTemp } = props;

  useEffect(() => {
    let dragRef: any = {};
    dragRef[id] = tempRef.current;
    setTempRef(dragRef);
  });

  return(
    <div className="blockelem noselect block dragging" style={{ left: left, top: top }} ref={tempRef}>
      <input type="hidden" name="blockelemtype" className="blockelemtype" value={type}/>
      <div className="blockyleft">
        <img width='25' height='25' src={tempBlocks[(type-1)].icon} alt="" />
        <p className='blockyname'>{tempBlocks[(type-1)].title}</p>
      </div>
      <div className="blockydiv" />
      <div className="blockyinfo" dangerouslySetInnerHTML={({__html:tempBlocks[(type-1)].desc})} />
      <input type="hidden" name="blockid" className="blockid" value={id}/>
      {
        blocksTemp ? blocksTemp.map((val, index) =>(
          <div className="blockelem noselect block dragging" style={{left:val.left,top:val.top}} key={`--${index}`}>
            <input type="hidden" name="blockelemtype" className="blockelemtype" value={val.type}/>
            <div className="blockyleft">
              <img width='25' height='25' src={tempBlocks[(val.type-1)].icon} alt="" />
              <p className='blockyname'>{tempBlocks[(val.type-1)].title}</p>
            </div>
            <div className="blockydiv" />
            <div className="blockyinfo" dangerouslySetInnerHTML={({__html:tempBlocks[(val.type-1)].desc})} />
            <input type="hidden" name="blockid" className="blockid" value={val.id}/>
          </div>
        )) : null
      }
      {
        arrowsTemp ? arrowsTemp.map((val, index) =>(
          <div className="arrowblock" style={{left:val.left,top:val.top}} key={`__${index}`} >
            <input type="hidden" className="arrowid" value={val.id}/>
            <svg preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={val.path1} stroke="#C5CCD0" strokeWidth="2px"/>
              <path d={val.path2} fill="#C5CCD0"/>
            </svg>
          </div>
        )) : null
      }
    </div>
  );
}

export default TempBlock;
