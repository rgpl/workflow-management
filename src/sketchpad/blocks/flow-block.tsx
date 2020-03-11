import React, {Component} from 'react';

import eyeblue from '../assets/eyeblue.svg';
import more from '../assets/more.svg';
import actionblue from '../assets/actionblue.svg';
import timeblue from '../assets/timeblue.svg';
import errorblue from '../assets/errorblue.svg';
import databaseorange from '../assets/databaseorange.svg';
import twitterorange from '../assets/twitterorange.svg';
import actionorange from '../assets/actionorange.svg';
import logred from '../assets/logred.svg';
import errorred from '../assets/errorred.svg';

const flowBlocks = [
    {
        icon:eyeblue,
        title:'Enter Workflow',
        desc:'When a <span>New User</span> goes to <span>Site 1</span>'
    },
    {
        icon:actionblue,
        title:'Action is performed',
        desc:'When <span>Action 1</span> is performed'
    },
    {
        icon:timeblue,
        title:'Time has passed',
        desc:'When <span>10 seconds</span> have passed'
    },
    {
        icon:errorblue,
        title:'Exit Workflow',
        desc:'When <span>10 seconds</span> have passed'
    },
    {
        icon:databaseorange,
        title:'New database entry',
        desc:'Add <span>Data object</span> to <span>Database 1</span>'
    },
    {
        icon:databaseorange,
        title:'Update database',
        desc:'Update <span>Database 1</span>'
    },
    {
        icon:actionorange,
        title:'Perform an action',
        desc:'Perform <span>Action 1</span>'
    },
    {
        icon:twitterorange,
        title:'Make a tweet',
        desc:'Tweet <span>Query 1</span> with the account <span>@twitter</span>'
    },
    {
        icon:logred,
        title:'Add new log entry',
        desc:'Add new <span>success</span> log entry'
    },
    {
        icon:logred,
        title:'Update logs',
        desc:'Edit <span>Log Entry 1</span>'
    },
    {
        icon:errorred,
        title:'Prompt an error',
        desc:'Trigger <span>Exit</span>'
    }

];

type FlowProps = {
    style:any,
    type:number,
    id:number
}

class FlowBlock extends Component<FlowProps> {

    render (){
        return(
            <div className="blockelem noselect block dragging" style={this.props.style}>
                <input type="hidden" name="blockelemtype" className="blockelemtype" value={this.props.type}/>
                <div className="blockyleft">
                    <img width='25' height='25' src={flowBlocks[(this.props.type-1)].icon} alt="" />
                    <p className='blockyname'>{flowBlocks[(this.props.type-1)].title}</p>
                </div>
                <div className="blockyright">
                    <img src={more} alt=""/>
                </div>
                <div className="blockydiv"></div>
                <div className="blockyinfo" dangerouslySetInnerHTML={({__html:flowBlocks[(this.props.type-1)].desc})}></div>
                <input type="hidden" name="blockid" className="blockid" value={this.props.id}/>

            </div>
        )

    }



};

export default FlowBlock;
