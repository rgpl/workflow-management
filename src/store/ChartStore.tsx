import { useLocalObservable } from "mobx-react-lite";
import React from "react";
import {IChart, ILink, INode} from "@artemantcev/react-flow-chart";
import { ISelectedOrHovered } from "@artemantcev/react-flow-chart/src/types/chart";

interface IChartStore {
  chart: IChart,
  removeNode: (nodeId: string) => void,
  removeLink: (linkId: string) => void,
  addNode: (newNode: INode, newId: string) => void,
  addLink: (newLink: ILink, newId: string) => void,
}

const ChartStoreContext = React.createContext<IChartStore|null>(null);

export const ChartStoreProvider = ({ children }: { children: any }) => {
  const store = useLocalObservable(createChartStore);
  return <ChartStoreContext.Provider value={store}>{children}</ChartStoreContext.Provider>;
};

export const MAX_ZOOM_VALUE: number = 1;
export const NODE_TYPE_ENTER_WORKFLOW = "Enter Workflow";
export const NODE_ID_ROOT = "root";
export const PORT_ID_INPUT = "portInput";
export const PORT_TYPE_OUTPUT = "output";

export const CHART_DEFAULT: IChart = {
  offset: {
    x: -1000,
    y: 0,
  },
  scale: MAX_ZOOM_VALUE,
  nodes: {
    [NODE_ID_ROOT]: {
      id: NODE_ID_ROOT,
      type: NODE_TYPE_ENTER_WORKFLOW,
      position: {
        x: 1500,
        y: 30,
      },
      ports: {
        portOutput1: {
          id: 'portOutput1',
          type: PORT_TYPE_OUTPUT,
          properties: {
            value: 'yes',
            align: "center",
            treeRearrangerPosition: 1
          },
        },
      },
      properties: {
        description: "Triggers when somebody visits a specified page",
        descriptionInstance: "When a New User goes to Site 1",
        icon: "eye",
        flyoutType: "emailAction",
        flyoutObject: {}
      }
    },
  },
  links: {},
  selected: {} as ISelectedOrHovered,
  hovered: {} as ISelectedOrHovered,
};

const createChartStore = (): IChartStore => {
  return {
    chart: CHART_DEFAULT,
    addNode(newNode: INode, newId: string) {
      this.chart.nodes[newId] = newNode;
    },
    addLink(newLink: ILink, newId: string) {
      this.chart.links[newId] = newLink;
    },
    removeNode(nodeId: string): void {
      // remove the related links to prevent an error
      for (let linkId in this.chart.links) {
        if (this.chart.links[linkId].from.nodeId === nodeId || this.chart.links[linkId].to.nodeId === nodeId) {
          delete this.chart.links[linkId];
        }
      }

      delete this.chart.nodes[nodeId];
    },
    removeLink(linkId: string): void {
      delete this.chart.links[linkId];
    }
  };
};

export const useChartStore = () => {
  const store = React.useContext(ChartStoreContext);

  if (!store) {
    throw new Error('useChartStore must be used within a ChartStoreProvider.');
  }

  return store;
};
