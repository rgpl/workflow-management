import * as React from 'react'
import {ILink, INode, IPortDefaultProps} from "@artemantcev/react-flow-chart";
import styled from "styled-components";
import { Observer } from "mobx-react-lite";
import {PORT_ID_INPUT, PROPERTY_NODE_IS_DISCONNECTED, useChartStore} from "../../../store/ChartStore";
import v4 from "uuid/v4";

const PortDefaultOuter = styled.div`
  width: 24px;
  height: 24px;
  background: white;
  cursor: pointer;
  margin-left: 15px;
  margin-right: 15px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PORT_TYPE_OUTPUT = "output";

const PortDefaultInner = styled.div<{ color: string }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background: ${(props) => props.color };
  cursor: pointer;
`;

function PortCustom(props: IPortDefaultProps) {
  const chartStore = useChartStore();

  return (
    <Observer>{() => (
      <PortDefaultOuter
        onDragOver={ (event) => {console.log("WOW");}}
        // TODO: move to the service component
        onDrop={ (event) => {
          // prevent new nodes from connecting to input ports
          if (props.port.id === PORT_ID_INPUT) {
            return;
          }

          const nodeWidth = 100;
          const horizontalIntervalWidth = 50;
          const verticalIntervalHeight = 150;

          const newNode = JSON.parse(event.dataTransfer.getData("react-flow-chart")) as INode;
          const newNodeId = v4();









          // let linksCount = Object.keys(chartStore.chart.links).length;
          let linksCount: number = 0;

          for (let linkId in chartStore.chart.links) {
            let linkObject: ILink = chartStore.chart.links[linkId];
            if (linkObject.to.nodeId && linkObject.from.nodeId === props.node.id) {
              linksCount++;
            }
          }

          if (linksCount === 0) {
            newNode.position = {
              x: props.node.position.x,
              y: props.node.position.y + verticalIntervalHeight,
            }
          } else {
            let nodeIdsToMove: string[] = [];

            for (let linkId in chartStore.chart.links) {
              let linkObject: ILink = chartStore.chart.links[linkId];
              if (linkObject.to.nodeId && linkObject.from.nodeId === props.node.id) {
                nodeIdsToMove.push(linkObject.to.nodeId)
              }
              if (linkObject.from.nodeId && linkObject.to.nodeId === props.node.id) {
                nodeIdsToMove.push(linkObject.from.nodeId)
              }
            }

            // default position to prevent "_a is undefined" error
            newNode.position = {
              x: props.node.position.x,
              y: props.node.position.y + verticalIntervalHeight,
            }
          }

          newNode.id = newNodeId;
          chartStore.addNode(newNode, newNodeId);

          const newLinkId = v4();
          const newLink: ILink = {
            id: newLinkId,
            from: {
              nodeId: props.node.id,
              portId: props.port.id,
            },
            to: {
              nodeId: newNode.id,
              portId: newNode.ports[PORT_ID_INPUT].id,
            },
          };

          chartStore.addLink(newLink, newLinkId);




          /* rearranging higher branches/divisions */
          let higherNodeIds: string[] = [];

          const searchForAllParentNodes = (currentNodeId: string) => {
            for (let linkId in chartStore.chart.links) {
              let linkObject: ILink = chartStore.chart.links[linkId];
              if (linkObject.from.nodeId && linkObject.to.nodeId === currentNodeId) {
                higherNodeIds.push(linkObject.from.nodeId);
                searchForAllParentNodes(linkObject.from.nodeId);
              }
            }
          };

          const searchForAllChildrenNodes = (currentNodeId: string): string[] => {
            let childrenNodesOfBranchIds: string[] = [];

            for (let linkId in chartStore.chart.links) {
              let linkObject: ILink = chartStore.chart.links[linkId];
              if (linkObject.to.nodeId && linkObject.from.nodeId === currentNodeId) {
                childrenNodesOfBranchIds.push(linkObject.to.nodeId);
                childrenNodesOfBranchIds = childrenNodesOfBranchIds.concat(searchForAllChildrenNodes(linkObject.to.nodeId));
              }
            }

            return childrenNodesOfBranchIds;
          };

          searchForAllParentNodes(props.node.id);
          higherNodeIds.push(props.node.id);

          let parentNodeHasMoreThanOneChild = false;
          let parentOutcomeLinksCount = 1;

          for (let linkId in chartStore.chart.links) {
            let linkObject: ILink = chartStore.chart.links[linkId];
            if (linkObject.from.nodeId === props.node.id && linkObject.to.nodeId !== newNodeId) {
              parentNodeHasMoreThanOneChild = true;
              parentOutcomeLinksCount++;
            }
          }

          if (!parentNodeHasMoreThanOneChild) {
            return;
          }

          higherNodeIds.forEach((nodeId: string) => {
            for (let linkId in chartStore.chart.links) {
              let linkObject: ILink = chartStore.chart.links[linkId];
              // unrelated branch detected, move it
              if (linkObject.to.nodeId && linkObject.from.nodeId === nodeId
                && !higherNodeIds.includes(linkObject.to.nodeId)
                && linkObject.to.nodeId !== newNodeId
              ) {

                let childrenNodesOfBranchIds: string[] = searchForAllChildrenNodes(linkObject.to.nodeId);
                childrenNodesOfBranchIds.push(linkObject.to.nodeId);

                childrenNodesOfBranchIds.forEach((childNodeId: string) => {
                  if (newNode.position.x <= chartStore.chart.nodes[childNodeId].position.x) {
                    chartStore.chart.nodes[childNodeId].position.x = chartStore.chart.nodes[childNodeId].position.x + nodeWidth + horizontalIntervalWidth;
                  } else {
                    chartStore.chart.nodes[childNodeId].position.x = chartStore.chart.nodes[childNodeId].position.x - nodeWidth - horizontalIntervalWidth;
                  }
                });

                if (nodeId === props.node.id) {
                  if (parentOutcomeLinksCount % 2 === 0) {
                    chartStore.chart.nodes[newNodeId].position.x = chartStore.chart.nodes[newNodeId].position.x - nodeWidth - horizontalIntervalWidth;
                  }
                }
              }
            }
          });
        }}
      >
        <PortDefaultInner
          color={props.port.properties.linkColor ?? 'cornflowerblue'}
        >
          {props.port.type === PORT_TYPE_OUTPUT
            ? <div className="blockyinfo" style={{ marginTop: "20px", marginLeft: "-15px" }}>{props.port.properties.title}</div>
            : ''}
        </PortDefaultInner>
      </PortDefaultOuter>
    )}</Observer>
  );
}

export default PortCustom;
