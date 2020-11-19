import * as React from 'react'
import {ILink, INode, IPortDefaultProps} from "@artemantcev/react-flow-chart";
import styled from "styled-components";
import { Observer } from "mobx-react-lite";
import {PORT_ID_INPUT, useChartStore} from "../../../store/ChartStore";
import v4 from "uuid/v4";
import {useEffect, useState} from "react";

const PortDefaultOuter = styled.div<{ visibility: string, portStyleAddition: string }>`
  cursor: pointer;
  visibility: ${(props) => props.visibility};
  ${(props) => props.portStyleAddition}
  border-radius: 0%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PORT_TYPE_OUTPUT = "output";

const PortDefaultInner = styled.div<{ color: string, isPortInput: boolean, isDraggedOver: boolean }>`
  width: 12px;
  height: 12px;
  transition: all .2s ease-in-out;
  transform: ${(props) => props.isDraggedOver ? 'scale(1.7)' : 'none' };
  ${(props) => !props.isPortInput ? 'margin-top: -35px;' : '' };
  border-radius: 50%;
  background: ${(props) => props.color };
  cursor: pointer;
`;

function PortCustom(props: IPortDefaultProps) {
  const chartStore = useChartStore();
  let [isPortAlreadyLinked, setIsPortAlreadyLinked] = useState(false);
  let [isDraggedOver, setIsDraggedOver] = useState(false);

  const isPortInput = props.port.id === PORT_ID_INPUT;
  // input port style
  let portStyleAddition: string = 'margin-top: 7px;';

  // TODO: move styling away from the component!
  if (!isPortInput) {
    if (Object.keys(props.node.ports).length >= 4) {
      // 3-outputs node
      portStyleAddition = "margin-bottom: -25px;\n padding: 20px 20px 20px 20px;";
    } else {
      if (props.port.properties.align === "left") {
        // left output
        portStyleAddition = "margin-bottom: -35px;\n padding: 30px 30px 30px 50px;";
      } else if (props.port.properties.align === "right") {
        // right output
        portStyleAddition = "margin-bottom: -35px;\n padding: 30px 50px 30px 30px;";
      } else {
        // an output with unspecified align property
        portStyleAddition = "margin-bottom: -35px;\n padding: 30px 80px 30px 80px;";
      }
    }
  }

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
  }, [chartStore.chart, portStyleAddition]);

  return (
    <Observer>{() => (
      <PortDefaultOuter
        portStyleAddition={portStyleAddition}
        visibility={
          (!props.config.portsAreHidden && !isPortAlreadyLinked && !props.config.readonly)
          || (!isPortAlreadyLinked && props.port.type === "input" && !props.config.readonly)
            ? "visible" : "hidden"
        }
        onDragEnter={ (event) => {
          setIsDraggedOver(true);
        }}
        onDragLeave={ (event) => {
          setIsDraggedOver(false);
        }}
        onDrop={ (event) => {
          // prevent new nodes from connecting to input ports
          if (props.port.id === PORT_ID_INPUT || props.config.readonly) {
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
          // TODO: move the arranger code into a separate service. it should be called from here.
          // TODO: optimize MobX store calls && check for redundant iterations and unused code
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
          isPortInput={isPortInput}
          isDraggedOver={isDraggedOver}
          color={props.port.properties.linkColor ?? 'cornflowerblue'}
          style={{pointerEvents: 'none'}}
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
