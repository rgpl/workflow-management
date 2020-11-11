import * as React from 'react'
import {IPortDefaultProps} from "@mrblenny/react-flow-chart";
import styled from "styled-components";

const PortDefaultOuter = styled.div`
  width: 24px;
  height: 24px;
  background: white;
  cursor: pointer;
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
  <PortDefaultOuter
    onDragOver={ (event) => {console.log("WOW");}}
    onDrop={ (event) => {console.log(event.dataTransfer.getData("react-flow-chart"));}}

  >

    <PortDefaultInner
      active={!props.config.readonly && (props.isLinkSelected || props.isLinkHovered)}
    />
  </PortDefaultOuter>
);

export default PortCustom;