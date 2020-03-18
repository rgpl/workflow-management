import React , { Component } from 'react';

import eyeblue from '../assets/eyeblue.svg';
import actionblue from '../assets/actionblue.svg';
import timeblue from '../assets/timeblue.svg';
import errorblue from '../assets/errorblue.svg';
import databaseorange from '../assets/databaseorange.svg';
import twitterorange from '../assets/twitterorange.svg';
import actionorange from '../assets/actionorange.svg';
import logred from '../assets/logred.svg';
import errorred from '../assets/errorred.svg';
import more from '../assets/more.svg';

const tempBlocks = [
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

type TempProp = {
    style:any;
    type:number;
    id:number;
    blocksTemp:Array<any>;
    arrowsTemp:Array<any>;
    setTempRef:(temp:any) => void;
}

class TempBlock extends Component<TempProp> {
    tempRef:any;

    constructor(props:TempProp){
        super(props);
        this.tempRef = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        const { setTempRef } = this.props;

        setTempRef(this.tempRef.current);
    }

    render(){
        const { style, type, id, blocksTemp, arrowsTemp } = this.props;

        return(
            <div className="blockelem noselect block dragging" style={style} ref={this.tempRef}>
                <input type="hidden" name="blockelemtype" className="blockelemtype" value={type}/>
                <div className="blockyleft">
                    <img width='25' height='25' src={tempBlocks[(type-1)].icon} alt="" />
                    <p className='blockyname'>{tempBlocks[(type-1)].title}</p>
                </div>
                <div className="blockyright">
                    <img src={more} alt="" />
                </div>

                <div className="blockydiv"></div>
                <div className="blockyinfo" dangerouslySetInnerHTML={({__html:tempBlocks[(type-1)].desc})}></div>
                <input type="hidden" name="blockid" className="blockid" value={id}/>
                {
                    blocksTemp ? blocksTemp.map((val,index) =>(
                        <div className="blockelem noselect block dragging" style={val.style} key={`--${index}`}>
                            <input type="hidden" name="blockelemtype" className="blockelemtype" value={val.type}/>
                            <div className="blockyleft">
                                <img width='25' height='25' src={tempBlocks[(val.type-1)].icon} alt="" />
                                <p className='blockyname'>{tempBlocks[(val.type-1)].title}</p>
                            </div>
                            <div className="blockyright">
                                <img src={more} alt="" />
                            </div>

                            <div className="blockydiv"></div>
                            <div className="blockyinfo" dangerouslySetInnerHTML={({__html:tempBlocks[(val.type-1)].desc})}></div>
                            <input type="hidden" name="blockid" className="blockid" value={val.id}/>
                        </div>
                    )):null
                }
                {
                    arrowsTemp ? arrowsTemp.map((val,index) =>(
                        <div className="arrowblock" style={val.style} key={`__${index}`}>
                            <input type="hidden" className="arrowid" value={val.id}/>
                            <svg preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d={val.path1} stroke="#C5CCD0" strokeWidth="2px"/>
                                <path d={val.path2} fill="#C5CCD0"/>
                            </svg>
                        </div>
                    )) : null
                }
            </div>
        )
    }
}

export default TempBlock;