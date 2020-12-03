import * as React from 'react'
import {IConfig, INode} from "@artemantcev/react-flow-chart";
import { EuiIcon } from "@elastic/eui";
import NodeIconWrapper from "./icon/NodeIconWrapper";
import { Observer } from "mobx-react-lite";
import {NODE_TYPE_ENTER_WORKFLOW, useChartStore} from "../../../store/ChartStore";
import TreeRearranger from "../service/TreeRearranger";
import PortDropUtils from "../service/PortDropUtils";

export interface INodeInnerDefaultProps {
  node: INode,
  config: IConfig
}

export const NodeInner = ({ node, config }: INodeInnerDefaultProps) => {
  const chartStore = useChartStore();

  const removeNode = (nodeId: string) => {
    let parentNodeId: string|undefined = undefined;

    for (const linkId in chartStore.chart.links) {
      // if the node being removed had any parent
      if (chartStore.chart.links[linkId].to.nodeId === nodeId) {
        parentNodeId = chartStore.chart.links[linkId].from.nodeId;
        break;
      }
    }

    chartStore.removeNode(nodeId);

    if (parentNodeId) {
      const treeRootNodeId: string = PortDropUtils.findTreeRootNode(chartStore.chart, parentNodeId);
      const treeRearranger = new TreeRearranger(chartStore.chart, treeRootNodeId, undefined);
      chartStore.chart = treeRearranger.calculateRearrangedTree();
    }
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
