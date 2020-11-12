import { useLocalObservable } from "mobx-react-lite";
import React from "react";
import { IChart } from "@mrblenny/react-flow-chart";
import { ISelectedOrHovered } from "@mrblenny/react-flow-chart/src/types/chart";

interface IChartStore {
  chart: IChart,
}

const ChartStoreContext = React.createContext<IChartStore|null>(null);

export const ChartStoreProvider = ({ children }: { children: any }) => {
  const store = useLocalObservable(createChartStore);
  return <ChartStoreContext.Provider value={store}>{children}</ChartStoreContext.Provider>;
};

export const FIXED_ZOOM_VALUE: number = 1;

const createChartStore = (): IChartStore => {
  return {
    chart: {
      offset: {
        x: 0,
        y: 0,
      },
      scale: FIXED_ZOOM_VALUE,
      nodes: {
        node1: {
          id: 'node1',
          type: 'Enter Workflow',
          position: {
            x: 500,
            y: 100,
          },
          ports: {
            port1: {
              id: 'port1',
              type: 'output',
              properties: {
                value: 'yes',
              },
            },
          },
        },
      },
      links: {},
      selected: {} as ISelectedOrHovered,
      hovered: {} as ISelectedOrHovered,
    },
  };
};

export const useChartStore = () => {
  const store = React.useContext(ChartStoreContext);

  if (!store) {
    throw new Error('useChartStore must be used within a ChartStoreProvider.');
  }

  return store;
};
