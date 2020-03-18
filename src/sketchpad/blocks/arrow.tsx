import React ,{Component} from 'react';

type ArrowProps = {
    id:number,
    path1:string,
    path2:string,
    style:any,
    setArrowRef:(id:number,arrow:any) => void;
}
export default class Arrow extends Component<ArrowProps> {

    arrowRef:any;

    constructor(props:ArrowProps) {
        super(props);
        this.arrowRef = React.createRef<HTMLDivElement>();
    }

    componentDidMount() {
        const { setArrowRef, id } = this.props;
        setArrowRef(id,this.arrowRef.current);
    }

    render(){
        const {id, path1, path2, style} = this.props;
        return (
            <div className="arrowblock" style={style} ref={this.arrowRef}>
                <input type="hidden" className="arrowid" value={id}/>
                <svg preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d={path1} stroke="#C5CCD0" strokeWidth="2px"/>
                    <path d={path2} fill="#C5CCD0"/>
                </svg>
            </div>
        )

    }
}
