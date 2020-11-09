import * as React from 'react'
import styled from 'styled-components'
import {INode, REACT_FLOW_CHART} from "@mrblenny/react-flow-chart";

const Outer = styled.div`
  padding: 10px 20px;
  font-size: 11px;
  background: white;
  cursor: move;
`

export interface ISidebarItemProps {
  type: string,
  ports: INode['ports'],
  properties?: any,
}

export const PickSidebarItem = ({ type, ports, properties }: ISidebarItemProps) => {
  return (
    <Outer
      draggable={true}
      onDragStart={ (event) => {
        event.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify({ type, ports, properties }))
      } }
    >
      <div className="blockelem create-flowy noselect">
        <input type="hidden" name='blockelemtype' className="blockelemtype" value="5"/>
        <div className="blockin">
          <div className="blocktext">
            <p className="blocktitle">{type}</p>
            <p className="blockdesc">Push notification based on the action definition</p>
          </div>
        </div>
      </div>
    </Outer>
  )
}