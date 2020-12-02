import { IChart, IPosition } from "@artemantcev/react-flow-chart";
import dagre from "dagre";

const BLOCK_WIDTH: string = "200";
const BLOCK_HEIGHT: string = "100";

export default class TreeRearranger {
  private readonly chart: IChart;
  private readonly treeRootNodeId: string;
  private readonly treeRootInitialPosition: IPosition;

  constructor(chart: IChart, treeRootNodeId: string) {
    this.chart = chart;
    this.treeRootNodeId = treeRootNodeId;
    this.treeRootInitialPosition = chart.nodes["root"].position;
  }

  calculateRearrangedTree(): IChart {
    let graph = new dagre.graphlib.Graph();

    graph.setGraph({});
    graph.setDefaultEdgeLabel(function() { return {}; });

    for (const nodeId in this.chart.nodes) {
      graph.setNode(nodeId, { label: nodeId, width: BLOCK_WIDTH, height: BLOCK_HEIGHT });
    }

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
      this.chart.nodes[nodeId].position = {
        x: graph.node(nodeId).x,
        y: graph.node(nodeId).y,
      }
    });

    // because dagrejs moves the root node into a top-left corner of the canves
    this.shiftRootNodeWithChildrenBack();

    return this.chart;
  }

  private shiftRootNodeWithChildrenBack(): void {
    const incorrectRootNodePosition: IPosition = this.chart.nodes["root"].position;
    this.chart.nodes["root"].position = this.treeRootInitialPosition;

    for (const nodeId in this.chart.nodes) {
      if (nodeId === "root") {
        continue;
      }

      this.chart.nodes[nodeId].position.x = this.chart.nodes["root"].position.x + this.chart.nodes[nodeId].position.x - incorrectRootNodePosition.x;
    }
  }
}
