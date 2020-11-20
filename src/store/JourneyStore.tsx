import React from "react";
import { useLocalObservable } from "mobx-react-lite";

const JourneyStoreContext = React.createContext({} as IJourneyStore);

interface IJourneyStore {
  journeyList: JList[],
  authenticated: boolean,
  setJourneyList: (journeyList: JList[]) => void,
}

export interface JList {
  id: string
}

export const JourneyStoreProvider = ({children} : { children: any }) => {
  const store = useLocalObservable(createJourneyStore);
  return <JourneyStoreContext.Provider value={store}>{children}</JourneyStoreContext.Provider>;
};

export const useJourneyStore = () => {
  const store = React.useContext(JourneyStoreContext);
  if (!store) {
    throw new Error('useJourneyStore must be used within a JourneyStoreProvider.');
  }
  return store;
};

export const createJourneyStore = (): IJourneyStore => {
  return {
    journeyList: [],
    authenticated: true,

    setJourneyList(journeyList: JList[]) {
      this.journeyList = journeyList;
    }
  };
}
