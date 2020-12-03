import {IChart, ILink, INode, IPort} from "@artemantcev/react-flow-chart";
import v4 from "uuid/v4";
import {PORT_ID_INPUT} from "../../../store/ChartStore";
import TreeRearranger from "./TreeRearranger";

export default class PortDropUtils {
  static initializeNewNodeAndConnect(chart: IChart, parentNode: INode, outcomePort: IPort, newNode: INode): IChart {
    const newNodeId = v4();

    newNode.position = {
      x: parentNode.position.x,
      y: parentNode.position.y,
    }

    newNode.id = newNodeId;
    chart.nodes[newNodeId] = newNode;

    const newLinkId = v4();

    const newLink: ILink = {
      id: newLinkId,
      from: {
        nodeId: parentNode.id,
        portId: outcomePort.id,
      },
      to: {
        nodeId: newNode.id,
        portId: newNode.ports[PORT_ID_INPUT].id,
      },
    };

    chart.links[newLink.id] = newLink;

    const treeRootNodeId: string = PortDropUtils.findTreeRootNode(chart, parentNode.id);
    const treeRearranger = new TreeRearranger(chart, treeRootNodeId, parentNode.id);
    chart = treeRearranger.calculateRearrangedTree();

    return chart;
  }

  static findTreeRootNode(chart: IChart, memberOfTreeNodeId: string): string {
    let rootId: string = memberOfTreeNodeId;

    for (const linkId in chart.links) {
      if (chart.links[linkId].to.nodeId === memberOfTreeNodeId) {
        rootId = chart.links[linkId].from.nodeId;
        rootId = this.findTreeRootNode(chart, chart.links[linkId].from.nodeId);
      }
    }

    return rootId;
  }
}
