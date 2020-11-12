import * as React from 'react';
import {INode, REACT_FLOW_CHART} from "@mrblenny/react-flow-chart";
import PickItemIconWrapper from "./icon/PickItemIconWrapper";

export interface ISidebarItemProps {
  type: string,
  description: string,
  icon: string,
  ports: INode['ports'],
  properties?: any,
}

export const PickSidebarItem = ({ type, description, icon, ports, properties }: ISidebarItemProps) => {
  return (
    <div
      draggable={true}
      onDragStart={ (event) => {
        event.dataTransfer.setData(REACT_FLOW_CHART, JSON.stringify({ type, ports, properties }))
      } }
    >
      <div className="blockelem">
        <input type="hidden" name='blockelemtype' className="blockelemtype"/>
        <div className="blockin">
          <div className="blockico">
            <PickItemIconWrapper iconName={icon} />
          </div>
          <div className="blocktext">
            <p className="blocktitle">{type}</p>
            <p className="blockdesc">{description}</p>
          </div>
        </div>
      </div>
    </div>
  )
};