import { PickSidebar, PickSidebarItem } from "./layout";
import React from "react";
import pickableNodes from "../../config/nodes.json";

function NodeMenu() {
  return (
    <PickSidebar>
      {pickableNodes.map((node: any) =>
        <PickSidebarItem
          type={node.type}
          ports={node.ports}
          properties={node.properties}
        />
      )}
    </PickSidebar>
  );
}

export default NodeMenu;