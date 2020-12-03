import * as React from 'react'
import {IConfig, INode} from "@artemantcev/react-flow-chart";
import { EuiIcon } from "@elastic/eui";
import NodeIconWrapper from "./icon/NodeIconWrapper";
import { Observer } from "mobx-react-lite";
import {NODE_ID_ROOT, NODE_TYPE_ENTER_WORKFLOW, useChartStore} from "../../../store/ChartStore";
import TreeRearranger from "../service/TreeRearranger";

export interface INodeInnerDefaultProps {
  node: INode,
  config: IConfig
}

export const NodeInner = ({ node, config }: INodeInnerDefaultProps) => {
  const chartStore = useChartStore();

  const removeNode = (nodeId: string) => {
    chartStore.removeNode(nodeId);
    const treeRearranger = new TreeRearranger(chartStore.chart, NODE_ID_ROOT, undefined);
    chartStore.chart = treeRearranger.calculateRearrangedTree();
  }

  return (
    <Observer>{() => (
      <div className="blockinstance lock">
        <div className="blockyleft">
          <NodeIconWrapper iconName={node.properties.icon}/>
          <p className='blockyname'>{node.type}</p>
          { (node.type !== NODE_TYPE_ENTER_WORKFLOW && !config.readonly)
            ? <EuiIcon type="cross" size="s" className="delete-icon" onClick={() => removeNode(node.id)}/>
            : ''
          }
        </div>
        <div className="blockydiv"/>
        <div className="blockyinfo">{node.properties.descriptionInstance}</div>
      </div>
    )}</Observer>
  );
}
