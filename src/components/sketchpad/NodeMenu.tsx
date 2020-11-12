import React from "react";
import pickableNodes from "../../config/nodes.json";
import { PickSidebarItem } from "./layout/PickSidebarItem";

function NodeMenu() {
  return (
    <div className="blocklist noselect">
      {pickableNodes.map((node: any) =>
        <PickSidebarItem
          type={node.type}
          ports={node.ports}
          properties={node.properties}
        />
      )}
    </div>
  );
}

export default NodeMenu;