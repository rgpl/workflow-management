import {IChart, ILink, IPosition} from "@artemantcev/react-flow-chart";
import dagre from "dagre";
import v4 from "uuid/v4";
import {PORT_ID_INPUT} from "../../../store/ChartStore";

const BLOCK_WIDTH: string = "200";
const BLOCK_HEIGHT: string = "100";

export default class TreeRearranger {
  private readonly chart: IChart;
  private readonly treeRootNodeId: string;
  private readonly treeRootInitialPosition: IPosition;

  private readonly newNodeId: string|undefined;

  constructor(chart: IChart, treeRootNodeId: string, newNodeId: string|undefined) {
    this.chart = chart;
    this.treeRootNodeId = treeRootNodeId;
    this.treeRootInitialPosition = chart.nodes[treeRootNodeId].position;
    this.newNodeId = newNodeId;
  }

  calculateRearrangedTree(): IChart {
    if (this.newNodeId !== undefined) {
      this.recreateOrderedLinksForNewNodeAndSiblingsIfSpecified();
    }

    let graph = new dagre.graphlib.Graph();

    graph.setGraph({});
    graph.setDefaultEdgeLabel(function() { return {}; });

    const childrenNodeIds: string[] = this.searchForAllChildrenNodes(this.treeRootNodeId);
    childrenNodeIds.push(this.treeRootNodeId);

    childrenNodeIds.forEach((nodeId) => {
      graph.setNode(nodeId, { label: nodeId, width: BLOCK_WIDTH, height: BLOCK_HEIGHT });
    });

    for (const linkId in this.chart.links) {
      const fromNode: string = this.chart.links[linkId].from.nodeId ?? "";
      const toNode: string = this.chart.links[linkId].to.nodeId ?? "";

      if (fromNode.length === 0 || toNode.length === 0) {
        continue;
      }

      graph.setEdge(fromNode, toNode);
    }

    dagre.layout(graph);

    graph.nodes().forEach(nodeId => {
      if (graph.node(nodeId) === undefined) {
        return;
      }

      this.chart.nodes[nodeId].position = {
        x: graph.node(nodeId).x,
        y: graph.node(nodeId).y,
      }
    });

    // because dagrejs moves the root node into a top-left corner of the canves
    this.shiftRootNodeWithChildrenBack(childrenNodeIds);

    return this.chart;
  }

  private shiftRootNodeWithChildrenBack(childrenNodeIds: string[]): void {
    const incorrectRootNodePosition: IPosition = this.chart.nodes[this.treeRootNodeId].position;
    this.chart.nodes[this.treeRootNodeId].position = this.treeRootInitialPosition;

    childrenNodeIds.forEach((nodeId) => {
      if (nodeId === this.treeRootNodeId) {
        return;
      }

      this.chart.nodes[nodeId].position.x = this.chart.nodes[this.treeRootNodeId].position.x + this.chart.nodes[nodeId].position.x - incorrectRootNodePosition.x;
      this.chart.nodes[nodeId].position.y = this.chart.nodes[this.treeRootNodeId].position.y + this.chart.nodes[nodeId].position.y - incorrectRootNodePosition.y;
    })
  }

  private recreateOrderedLinksForNewNodeAndSiblingsIfSpecified() {
    // treeRearrangerPosition, port id, destination node
    let usedDestinationsOfParentPorts: [number, string, string][] = [];

    // remove all the links from the parent before re-ordering
    for (let linkId in this.chart.links) {
      let linkObject: ILink = this.chart.links[linkId];
      if (linkObject.from.nodeId !== this.newNodeId || !linkObject.to.nodeId) {
        continue;
      }

      usedDestinationsOfParentPorts.push([
        this.chart.nodes[this.newNodeId].ports[linkObject.from.portId].properties["treeRearrangerPosition"],
        linkObject.from.portId,
        linkObject.to.nodeId
      ]);

      delete this.chart.links[linkId];
    }

    usedDestinationsOfParentPorts.sort((a, b) => {
      return a[0] - b[0];
    });

    usedDestinationsOfParentPorts.forEach((destination) => {
      const destinationNewLink: ILink = {
        id: v4(),
        from: {
          nodeId: this.newNodeId ?? "",
          portId: destination[1],
        },
        to: {
          nodeId: destination[2],
          portId: this.chart.nodes[destination[2]].ports[PORT_ID_INPUT].id,
        },
      };

      this.chart.links[destinationNewLink.id] = destinationNewLink;
    });
  }

  private searchForAllChildrenNodes(currentNodeId: string): string[] {
    let childrenNodesOfBranchIds: string[] = [];

    for (let linkId in this.chart.links) {
      let linkObject: ILink = this.chart.links[linkId];
      if (linkObject.to.nodeId && linkObject.from.nodeId === currentNodeId) {
        childrenNodesOfBranchIds.push(linkObject.to.nodeId);
        childrenNodesOfBranchIds = childrenNodesOfBranchIds.concat(this.searchForAllChildrenNodes(linkObject.to.nodeId));
      }
    }

    return childrenNodesOfBranchIds;
  };
}
