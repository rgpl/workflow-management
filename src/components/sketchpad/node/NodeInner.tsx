import * as React from 'react'
import styled from 'styled-components'
import {INode} from "@mrblenny/react-flow-chart";

export interface INodeInnerDefaultProps {
  node: INode
}

const Outer = styled.div`
  background: white;
  border-radius: 4px;
  width: 300px;
  padding: 40px 30px;
`;

export const NodeInner = ({ node }: INodeInnerDefaultProps) => {
  return (
    <Outer>
      <div>Type: { node.type }</div>
    </Outer>
  )
};