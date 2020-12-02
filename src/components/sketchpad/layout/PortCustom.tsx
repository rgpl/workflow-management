import * as React from 'react'
import {ILink, INode, IPortDefaultProps} from "@artemantcev/react-flow-chart";
import styled from "styled-components";
import { Observer } from "mobx-react-lite";
import {PORT_ID_INPUT, useChartStore} from "../../../store/ChartStore";
import v4 from "uuid/v4";
import {useEffect, useState} from "react";
import TreeRearranger from "../service/TreeRearranger";

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
          setIsDraggedOver(false);

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
              y: props.node.position.y,
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
              y: props.node.position.y,
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

          const treeRearranger = new TreeRearranger(chartStore.chart, "root");
          chartStore.chart = treeRearranger.calculateRearrangedTree();
        }}
      >
        <PortDefaultInner
          isPortInput={isPortInput}
          isDraggedOver={isDraggedOver}
          color={props.port.properties.linkColor ?? 'cornflowerblue'}
          style={{ pointerEvents: 'none' }}
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
