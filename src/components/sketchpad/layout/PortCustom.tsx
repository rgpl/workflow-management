import * as React from 'react'
import {ILink, INode, IPortDefaultProps} from "@artemantcev/react-flow-chart";
import styled from "styled-components";
import {Observer, useLocalStore} from "mobx-react-lite";
import {PORT_ID_INPUT, useChartStore} from "../../../store/ChartStore";
import v4 from "uuid/v4";
import {useEffect, useState} from "react";

const PortDefaultOuter = styled.div<{ visibility: string }>`
  width: 24px;
  height: 24px;
  background: white;
  cursor: pointer;
  visibility: ${(props) => props.visibility};
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
  let [isPortAlreadyLinked, setIsPortAlreadyLinked] = useState(false);

  useEffect(() => {
    let isLinked: boolean = false;

    for (let linkId in chartStore.chart.links) {
      let linkObject: ILink = chartStore.chart.links[linkId];
      if (
        (linkObject.from.portId === props.port.id && linkObject.from.nodeId === props.node.id)
        || (linkObject.to.portId === props.port.id && linkObject.to.nodeId === props.node.id)
      ) {
        isLinked = true;
        break;
      }
    }

    if (isLinked) {
      setIsPortAlreadyLinked(true);
    } else {
      setIsPortAlreadyLinked(false);
    }
  }, [chartStore.chart]);

  return (
    <Observer>{() => (
      <PortDefaultOuter
        visibility={(!props.config.portsAreHidden && !isPortAlreadyLinked) || (!isPortAlreadyLinked && props.port.type === "input") ? "visible" : "hidden" }
        onDrop={ (event) => {
          // prevent new nodes from connecting to input ports
          if (props.port.id === PORT_ID_INPUT) {
            return;
          }

          let outcomeHasLinkAlready: boolean = false;

          for (let linkId in chartStore.chart.links) {
            let linkObject: ILink = chartStore.chart.links[linkId];
            if (linkObject.from.nodeId === props.node.id && linkObject.from.portId === props.port.id) {
              outcomeHasLinkAlready = true;
              break;
            }
          }

          // avoid multiple links for a single outcome port (this check may be removed in the future)
          if (outcomeHasLinkAlready) {
            return;
          }

          const nodeWidth = 100;
          const horizontalIntervalWidth = 10;
          const verticalIntervalHeight = 150;

          const newNode = JSON.parse(event.dataTransfer.getData("react-flow-chart")) as INode;
          const newNodeId = v4();









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

          for (let linkId in chartStore.chart.links) {
            let linkObject: ILink = chartStore.chart.links[linkId];
            if (linkObject.from.nodeId === props.node.id && linkObject.to.nodeId !== newNodeId) {
              parentNodeHasMoreThanOneChild = true;
            }
          }

          if (!parentNodeHasMoreThanOneChild) {
            return;
          }

          let hasCenterChild: boolean = false;

          // check if the parent node has child node connected to its center port (if it exists)
          for (let linkId in chartStore.chart.links) {
            let linkObject: ILink = chartStore.chart.links[linkId];
            if (linkObject.from.nodeId === props.node.id) {
              if (chartStore.chart.nodes[props.node.id].ports[linkObject.from.portId].properties.align === "center") {
                hasCenterChild = true;
                break;
              }
            }
          }

          // iteration for higher branches (excluding the closest one)
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

                if (nodeId === props.node.id) {
                  // move all the existing nodes on the same row with newNode, but not newNode itself!
                  childrenNodesOfBranchIds.forEach((childNodeId: string) => {
                    if (hasCenterChild) {
                      if (chartStore.chart.nodes[nodeId].ports[linkObject.from.portId].properties.align === "left") {
                        chartStore.chart.nodes[childNodeId].position.x = chartStore.chart.nodes[props.node.id].position.x - nodeWidth*2 - horizontalIntervalWidth;
                      } else if (chartStore.chart.nodes[nodeId].ports[linkObject.from.portId].properties.align  === "right") {
                        chartStore.chart.nodes[childNodeId].position.x = chartStore.chart.nodes[props.node.id].position.x + nodeWidth*2 + horizontalIntervalWidth;
                      }
                    } else if (props.port.properties.align === "left") {
                      chartStore.chart.nodes[childNodeId].position.x = chartStore.chart.nodes[childNodeId].position.x + nodeWidth + horizontalIntervalWidth;
                    } else if (props.port.properties.align === "right") {
                      chartStore.chart.nodes[childNodeId].position.x = chartStore.chart.nodes[childNodeId].position.x - nodeWidth - horizontalIntervalWidth;
                    }
                  });

                  // move the newNode
                  if (nodeId === props.node.id) {
                    if (hasCenterChild) {
                      if (props.port.properties.align === "left") {
                        chartStore.chart.nodes[newNodeId].position.x = chartStore.chart.nodes[props.node.id].position.x - nodeWidth*2 - horizontalIntervalWidth;
                      } else if (props.port.properties.align === "right") {
                        chartStore.chart.nodes[newNodeId].position.x = chartStore.chart.nodes[props.node.id].position.x + nodeWidth*2 + horizontalIntervalWidth;
                      }
                    } else if (props.port.properties.align === "left") {
                      chartStore.chart.nodes[newNodeId].position.x = chartStore.chart.nodes[newNodeId].position.x - nodeWidth - horizontalIntervalWidth;
                    } else if (props.port.properties.align === "right") {
                      chartStore.chart.nodes[newNodeId].position.x = chartStore.chart.nodes[newNodeId].position.x + nodeWidth + horizontalIntervalWidth;
                    }
                  }
                } else {
                  const modifiedNodeWidth: number = hasCenterChild ? nodeWidth * 2 : nodeWidth;

                  childrenNodesOfBranchIds.forEach((childNodeId: string) => {
                    if (newNode.position.x <= chartStore.chart.nodes[childNodeId].position.x) {
                      chartStore.chart.nodes[childNodeId].position.x = chartStore.chart.nodes[childNodeId].position.x + modifiedNodeWidth + horizontalIntervalWidth;
                    } else {
                      chartStore.chart.nodes[childNodeId].position.x = chartStore.chart.nodes[childNodeId].position.x - modifiedNodeWidth - horizontalIntervalWidth;
                    }
                  });
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
