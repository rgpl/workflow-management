import * as React from 'react'
import {EuiIcon} from "@elastic/eui";
import NodeIconWrapper from "./icon/NodeIconWrapper";
import {INode} from "../flowchart/types";

export interface INodeInnerDefaultProps {
  node: INode,
  icon: string
}

export const NodeInner = ({ node }: INodeInnerDefaultProps, icon: string) => {
  return (
    <div className="blockinstance lock">
      <div className="blockyleft">
        <NodeIconWrapper iconName={icon} />
        <p className='blockyname'>{node.type}</p>
        <EuiIcon type="cross" size="s" className="delete-icon"/>
      </div>
      <div className="blockydiv" />
      <div className="blockyinfo">Test description</div>
    </div>
  );
}
