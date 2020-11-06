import React, {Component} from 'react';

import eye from '../../../assets/images/eye.svg';
import action from '../../../assets/images/action.svg';
import time from '../../../assets/images/time.svg';
import error from '../../../assets/images/error.svg';

const flowBlocks = [
  {
    icon: eye,
    title: 'Enter Workflow',
    desc: 'Triggers when somebody visits a specified page'
  },
  {
    icon: action,
    title: 'Event occurred',
    desc: 'Triggers when somebody performs a specified action'
  },
  {
    icon: time,
    title: 'Time has passed',
    desc: 'Triggers after a specified amount of time'
  },
  {
    icon: error,
    title: 'Exit Workflow',
    desc: 'Triggers when a specified error happens'
  },
  {
    icon: action,
    title: 'Push Action',
    desc: 'Push notification based on the action definition'
  },
  {
    icon: action,
    title: 'SMS Action',
    desc: 'SMS Messages will be sent out based on the action definition'
  },
  {
    icon: action,
    title: 'E-mail Action',
    desc: 'Email Communication will be sent out based on the action definition'
  },
  {
    icon: action,
    title: 'Web Api Action',
    desc: 'Web Api will be sent out based on the action definition'
  },
];

type DragProps = {
  left: number;
  top: number;
  type: number;
  id: number;
  setDragRef:(drag:any) => void;
};

class DraggedBlock extends Component<DragProps> {

  dragRef: any;

  constructor (props:DragProps) {
    super(props);
    this.dragRef = React.createRef<HTMLDivElement>();
  }

  componentDidMount(){
    const {setDragRef} = this.props;

    setDragRef(this.dragRef.current);
  }

  componentWillUnmount(){
    const {setDragRef} = this.props;

    setDragRef(null);
  }

  render() {
    const { left, top, type, id} = this.props;

    return (
      <div className="blockelem noselect block dragging" style={{left:left,top:top}} ref={this.dragRef}>
        <input type="hidden" name="blockelemtype" className="blockelemtype" value={type}/>
        <div className="blockin">
          <div className="blockico">
            <img src={flowBlocks[type-1].icon} alt=""/>

          </div>
          <div className="blocktext">
            <p className="blocktitle">{flowBlocks[type-1].title}</p>
            <p className="blockdesc">{flowBlocks[type-1].desc}</p>
          </div>
        </div>
        <input type="hidden" name="blockid" className="blockid" value={id}/>

      </div>
    )
  }
}

export default DraggedBlock;
