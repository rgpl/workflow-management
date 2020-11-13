import * as React from 'react'
import {INode, IPortDefaultProps} from "@artemantcev/react-flow-chart";
import styled from "styled-components";
import { Observer } from "mobx-react-lite";
import { useChartStore } from "../../../store/ChartStore";
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
        onDrop={ (event) => {
          const newNode = JSON.parse(event.dataTransfer.getData("react-flow-chart")) as INode;
          const newNodeId = v4();
          newNode.position = {
            x: props.node.position.x,
            y: props.node.position.y + 150,
          }
          newNode.id = newNodeId;
          console.log(newNode);
          chartStore.addNode(newNode, newNodeId);
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
