import * as React from 'react'
import {INode} from "@mrblenny/react-flow-chart";
import {EuiIcon} from "@elastic/eui";
import NodeIconWrapper from "./icon/NodeIconWrapper";

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
