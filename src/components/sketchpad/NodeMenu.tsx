import React from "react";
import pickableNodes from "../../config/nodes.json";
import { PickSidebarItem } from "./layout/PickSidebarItem";

function NodeMenu() {
  return (
    <div className="blocklist">
      {pickableNodes.map((node: any) =>
        <PickSidebarItem
          type={node.type}
          description={node.description}
          ports={node.ports}
          properties={node.properties}
        />
      )}
    </div>
  );
}

export default NodeMenu;