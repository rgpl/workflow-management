import React, {Component} from 'react';

import eye from '../assets/eye.svg';
import action from '../assets/action.svg';
import time from '../assets/time.svg';
import error from '../assets/error.svg';
import database from '../assets/database.svg';
import twitter from '../assets/twitter.svg';
import log from '../assets/log.svg';

const flowBlocks = [
    {
        icon:eye,
        title:'Enter Workflow',
        desc:'Triggers when somebody visits a specified page'
    },
    {
        icon:action,
        title:'Action is performed',
        desc:'Triggers when somebody performs a specified action'
    },
    {
        icon:time,
        title:'Time has passed',
        desc:'Triggers after a specified amount of time'
    },
    {
        icon:error,
        title:'Exit Workflow',
        desc:'Triggers when a specified error happens'
    },
    {
        icon:database,
        title:'New database entry',
        desc:'Adds a new entry to a specified database'
    },
    {
        icon:database,
        title:'Update database',
        desc:'Edits and deletes database entries and properties'
    },
    {
        icon:action,
        title:'Perform an action',
        desc:'Performs or edits a specified action'
    },
    {
        icon:twitter,
        title:'Make a tweet',
        desc:'Makes a tweet with a specified query'
    },
    {
        icon:log,
        title:'Add new log entry',
        desc:'Adds a new log entry to this project'
    },
    {
        icon:log,
        title:'Update logs',
        desc:'Edits and deletes log entries in this project'
    },
    {
        icon:error,
        title:'Prompt an error',
        desc:'Triggers a specified error'
    }

];

type DragProps = {
    style: any;
    type: number;
    id: number;
    setDragRef:(drag:any) => void;
};

class DraggedBlock extends Component<DragProps> {

    dragRef:any;

    constructor (props:DragProps) {
        super(props);
        this.dragRef = React.createRef<HTMLDivElement>();
    }

    componentDidUpdate(){
        const {setDragRef} = this.props;

        setDragRef(this.dragRef.current);
    }

    componentWillUnmount(){
        const {setDragRef} = this.props;

        setDragRef(null);
    }

    render() {

        return(
            <div className="blockelem noselect block dragging" style={this.props.style} ref={this.dragRef}>
                <input type="hidden" name="blockelemtype" className="blockelemtype" value={this.props.type}/>
                <div className="blockin">
                    <div className="blockico">
                        <span></span>
                        <img src={flowBlocks[this.props.type-1].icon} alt=""/>

                    </div>
                    <div className="blocktext">
                        <p className="blocktitle">{flowBlocks[this.props.type-1].title}</p>
                        <p className="blockdesc">{flowBlocks[this.props.type-1].desc}</p>
                    </div>
                </div>
                <input type="hidden" name="blockid" className="blockid" value={this.props.id}/>

            </div>
        )
    }

};

export default DraggedBlock;
