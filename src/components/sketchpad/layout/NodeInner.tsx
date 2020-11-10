import * as React from 'react'
import {INode} from "@mrblenny/react-flow-chart";
import {EuiIcon} from "@elastic/eui";

export interface INodeInnerDefaultProps {
  node: INode
}

export const NodeInner = ({ node }: INodeInnerDefaultProps) => {
  return (
    <div className="blockinstance lock">
      <div className="blockyleft">
        <img width='25' height='25' src="" alt="" />
        <p className='blockyname'>{node.type}</p>
        <EuiIcon type="cross" size="s" className="delete-icon"/>
      </div>
      <div className="blockydiv" />
      <div className="blockyinfo">Test description</div>
    </div>
  );
};