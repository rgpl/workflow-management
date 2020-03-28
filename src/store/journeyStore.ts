import { observable, action } from 'mobx';

export interface JList {
    id:string
    displayLabel:string
}

export class JourneyStore {

    @observable editJourney = false;
    @observable authenticated = true;
    @observable editMode = false;

    @observable journeyList:JList[] = [];

    @action 
    getExistingJourneys = ()=> {
        this.journeyList =[
            {
                id:"j_1",
                displayLabel:"Frequent User flow"
            },
            {
                id:"j_2",
                displayLabel:"Rare User flow"
            },
            {
                id:"j_3",
                displayLabel:"Addicted User flow"
            }
        ];
    }

    @action 
    setJourneyEdit = (mode:boolean) => {
        this.editJourney = mode;
    }

    @action
    setEditMode = (val:boolean) => {
        this.editMode = val;
    }

}

export const journeyStore = new JourneyStore();
