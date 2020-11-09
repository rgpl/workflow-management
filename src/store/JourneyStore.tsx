import React from "react";
import { useLocalObservable } from "mobx-react-lite";
import axios from "axios";

const JourneyStoreContext = React.createContext({} as IJourneyStore);

interface IJourneyStore {
  journeyList: JList[],
  editJourney: boolean,
  authenticated: boolean,
  editMode: boolean,
  getExistingJourneys: () => void,
  setJourneyEdit: (mode: boolean) => void,
  setEditMode: (mode: boolean) => void,
}

export interface JList {
  id: string
  displayLabel: string
}

export const JourneyStoreProvider = ({children} : { children: any }) => {
  const store = useLocalObservable(createJourneyStore);
  return <JourneyStoreContext.Provider value={store}>{children}</JourneyStoreContext.Provider>;
};

export const useJourneyStore = () => {
  const store = React.useContext(JourneyStoreContext);
  if (!store) {
    throw new Error('useStore must be used within a StoreProvider.');
  }
  return store;
};

export const createJourneyStore = (): IJourneyStore => {
  return {
    journeyList: [
      {
        id: "j_1",
        displayLabel: "Frequent User flow"
      },
      {
        id: "j_2",
        displayLabel: "Rare User flow"
      },
      {
        id: "j_3",
        displayLabel: "Addicted User flow"
      }
    ],
    editJourney: false,
    authenticated: true,
    editMode: false,

    getExistingJourneys: async() => {
      await axios.get('http://localhost:4000/journeys')
        .then((response) => {
          console.log("login-response->", response);
        })
        .catch((error) => console.log("login->", error))
        .finally(() => {
          // always executed
        });
    },

    setJourneyEdit(mode: boolean) {
      this.editJourney = mode;
    },

    setEditMode(val: boolean) {
      this.editMode = val;
    }
  };
}