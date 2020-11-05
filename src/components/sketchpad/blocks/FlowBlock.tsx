import React, {Component} from 'react';
import { EuiIcon } from '@elastic/eui';

import eyeblue from '../../../assets/images/eyeblue.svg';
import actionblue from '../../../assets/images/actionblue.svg';
import timeblue from '../../../assets/images/timeblue.svg';
import errorblue from '../../../assets/images/errorblue.svg';
import actionorange from '../../../assets/images/actionorange.svg';

const flowBlocks = [
    {
        icon:eyeblue,
        title:'Enter Workflow',
        desc:'When a <span>New User</span> goes to <span>Site 1</span>'
    },
    {
        icon:actionblue,
        title:'Event occurred',
        desc:'When <span>Action 1</span> is performed'
    },
    {
        icon:timeblue,
        title:'Time has passed',
        desc:'When <span>10 seconds</span> have passed'
    },
    {
        icon: errorblue,
        title:'Exit Workflow',
        desc:'When <span>10 seconds</span> have passed'
    },
    {
        icon: actionorange,
        title: 'Push Action',
        desc: 'Push <span>Action 1</span>'
    },
    {
        icon: actionorange,
        title: 'SMS Action',
        desc: 'SMS <span>Action 1</span>'
    },
    {
        icon: actionorange,
        title: 'E-mail Action',
        desc: 'E-mail <span>Action 1</span>'
    },
    {
        icon: actionorange,
        title: 'Web Api Action',
        desc: 'Web Api <span>Action 1</span>'
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
    left:number;
    top:number;
    type:number;
    id:number;
    link:any
    setFlowRef:(id:number,flow:any) => void;
    openConfigurator:()=> void;
    deleteBlock:(id:number)=> void;
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

    deleteFlow = (e:any) => {
        e.stopPropagation();
        const { id, deleteBlock } = this.props;
        deleteBlock(id);
    }

    render (){

        const { left, top, type, id, link, openConfigurator } = this.props;

        return(
            <div className="blockelem noselect block" style={{left:left,top:top}} ref={this.flowRef}>
                <input type="hidden" name="blockelemtype" className="blockelemtype" value={type}/>
                <div className="blockyleft" onClick={openConfigurator}>
                    <img width='25' height='25' src={flowBlocks[(type-1)].icon} alt="" />
                    <p className='blockyname'>{flowBlocks[(type-1)].title}</p>
                    <EuiIcon type="cross" size="s" className="delete-icon" onClick={this.deleteFlow}/>
                </div>

                <div className="blockydiv"></div>
                <div className="blockyinfo" dangerouslySetInnerHTML={({__html:flowBlocks[(type-1)].desc})}></div>
                <input type="hidden" name="blockid" className="blockid" value={id}/>
                <div className={`indicator ${link.show ? '': 'invisible'}`} style={linkPos[link.position]}></div>
            </div>
        )

    }



};

export default FlowBlock;
