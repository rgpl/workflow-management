import React, {Component} from 'react';
import FlowPop from './flow-pop';

import eyeblue from '../assets/eyeblue.svg';
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

const linkPos:any = {
    "left":{
        top:'50%',
        left:'0%'
    },
    "top":{
        top:'0%',
        left:'50%'
    },
    "right":{
        top:'50%',
        left:'100%'
    },
    "bottom":{
        top:'100%',
        left:'50%'
    }
}

type FlowProps = {
    style:any;
    type:number;
    id:number;
    link:any
    setFlowRef:(id:number,flow:any) => void;
    openConfigurator:()=> void;
}

class FlowBlock extends Component<FlowProps> {

    flowRef:any;

    constructor (props:FlowProps) {
        super(props);
        this.flowRef = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        const {setFlowRef, id} = this.props;

        setFlowRef(id,this.flowRef.current);
    }

    render (){
        
        const { style, type, id, link, openConfigurator } = this.props;

        return(
            <div className="blockelem noselect block dragging" style={style} ref={this.flowRef}>
                <input type="hidden" name="blockelemtype" className="blockelemtype" value={type}/>
                <div className="blockyleft">
                    <img width='25' height='25' src={flowBlocks[(type-1)].icon} alt="" />
                    <p className='blockyname'>{flowBlocks[(type-1)].title}</p>
                </div>

                <FlowPop id={this.props.id} openConfigurator={openConfigurator}/>

                <div className="blockydiv"></div>
                <div className="blockyinfo" dangerouslySetInnerHTML={({__html:flowBlocks[(type-1)].desc})}></div>
                <input type="hidden" name="blockid" className="blockid" value={id}/>
                <div className={`indicator ${link.show ? '': 'invisible'}`} style={linkPos[link.position]}></div>
            </div>
        )

    }



};

export default FlowBlock;
