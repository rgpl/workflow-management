import { observable, action } from 'mobx';
import  axios  from 'axios';

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
    getExistingJourneys = async()=> {
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

        await axios.get('http://localhost:4000/journeys')
            .then( (response:any)=> {
                console.log("login-response->",response);
                
            })
            .catch((error:any) => console.log("login->",error))
            .finally(() => {
                // always executed
            });
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
