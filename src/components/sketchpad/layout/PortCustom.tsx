import * as React from 'react'
import {IPortDefaultProps} from "@mrblenny/react-flow-chart";
import styled from "styled-components";

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

const PortCustom = (props: IPortDefaultProps) => (
  <>
    <PortDefaultOuter>
      <PortDefaultInner
        color={props.port.properties.linkColor ?? 'cornflowerblue'}
      >
        {props.port.type === PORT_TYPE_OUTPUT
          ? <div className="blockyinfo" style={{ marginTop: "20px", marginLeft: "-15px" }}>{props.port.properties.title}</div>
          : ''}
      </PortDefaultInner>
    </PortDefaultOuter>
  </>
);

export default PortCustom;