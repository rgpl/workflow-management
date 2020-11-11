import * as React from 'react'
import styled from "styled-components";
import {IPortDefaultProps} from "../flowchart/components/Port";

const PORT_TYPE_OUTPUT = "output";

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


const PortDefaultInner = styled.div<{ active: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background:  ${(props) => props.active ? 'cornflowerblue' : 'grey' };
  cursor: pointer;
`;

const PortCustom = (props: IPortDefaultProps) => (
  <>
    <PortDefaultOuter
      onDragOver={ (event) => {console.log("WOW");}}
      onDrop={ (event) => {console.log(event.dataTransfer.getData("react-flow-chart"));}}
    >
      <PortDefaultInner active={!props.config.readonly && (props.isLinkSelected || props.isLinkHovered)}>
        {props.port.type === PORT_TYPE_OUTPUT
          ? <div className="blockyinfo" style={{ marginTop: "20px", marginLeft: "-15px" }}>Triggered</div>
          : ''}
      </PortDefaultInner>
    </PortDefaultOuter>
  </>
);

export default PortCustom;