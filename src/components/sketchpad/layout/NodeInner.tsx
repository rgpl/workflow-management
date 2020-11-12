import * as React from 'react'
import { INode } from "@mrblenny/react-flow-chart";
import { EuiIcon } from "@elastic/eui";
import NodeIconWrapper from "./icon/NodeIconWrapper";
import { Observer } from "mobx-react-lite";
import { useChartStore } from "../../../store/ChartStore";

export interface INodeInnerDefaultProps {
  node: INode,
}

export const NodeInner = ({ node }: INodeInnerDefaultProps) => {
  const chartStore = useChartStore();

  return (
    <Observer>{() => (
      <div className="blockinstance lock">
        <div className="blockyleft">
          <NodeIconWrapper iconName={node.properties.icon}/>
          <p className='blockyname'>{node.type}</p>
          <EuiIcon type="cross" size="s" className="delete-icon" onClick={() => chartStore.removeNode(node.id)}/>
        </div>
        <div className="blockydiv"/>
        <div className="blockyinfo">{node.properties.descriptionInstance}</div>
      </div>
    )}</Observer>
  );
}
