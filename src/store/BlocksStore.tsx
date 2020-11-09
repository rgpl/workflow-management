import blockTypes from '../config/blocks-config.json';
import { useLocalObservable } from "mobx-react-lite";
import React from "react";

export interface BlockType {
  icon: string,
  title: string,
  description: string,
}

export interface ArrowInstance {
  type: number|undefined;
  id: number;
  left: number;
  top: number;
  path1: string;
  path2: string;
}

export interface BlockInstance {
  type: number;
  id: number;
  left: number;
  top: number;
  link: string;
}

export interface IBlocksStore {
  placedBlocks: BlockInstance[],
  placedArrows: ArrowInstance[],
  blockTypes: BlockType[],
}

const StoreContext = React.createContext<IBlocksStore|null>(null);

export const BlocksStoreProvider = ({ children }: { children: any }) => {
  const store = useLocalObservable(createBlocksStore);
  return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
};

const createBlocksStore = (): IBlocksStore => {
  return {
    blockTypes: blockTypes,
    placedArrows: [],
    placedBlocks: [],
  };
};

export const useBlocksStore = () => {
  const store = React.useContext(StoreContext);

  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }

  return store;
};
