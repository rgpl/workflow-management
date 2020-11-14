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









          let linksCount = Object.keys(chartStore.chart.links).length;

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

            nodeIdsToMove.forEach((nodeId: string) => {
              if (chartStore.chart.nodes[nodeId] && chartStore.chart.nodes[nodeId].position.y >  props.node.position.y) {
                if (chartStore.chart.nodes[nodeId] && chartStore.chart.nodes[nodeId].position.x <= props.node.position.x) {
                  chartStore.chart.nodes[nodeId].position.x = chartStore.chart.nodes[nodeId].position.x - nodeWidth - horizontalIntervalWidth;
                } else {
                  chartStore.chart.nodes[nodeId].position.x = chartStore.chart.nodes[nodeId].position.x + nodeWidth + horizontalIntervalWidth;
                }
              }
            });

            if (linksCount % 2 > 0) {
              newNode.position = {
                x: props.node.position.x + nodeWidth + horizontalIntervalWidth,
                y: props.node.position.y + verticalIntervalHeight,
              }
            } else {
              newNode.position = {
                x: props.node.position.x,
                y: props.node.position.y + verticalIntervalHeight,
              }
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
