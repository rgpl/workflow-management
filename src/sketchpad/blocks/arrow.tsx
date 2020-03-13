import React ,{Component} from 'react';


export default class Arrow extends Component {

    render(){

        return (
            <div className="arrowblock">
                <input type="hidden" className="arrowid" value="' + blockId + '"/>
                <svg preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M' + (this.blocks.filter(a => a.id === blocko[i])[0].x - arrowhelp.x + 5) + ' 0L' + (this.blocks.filter(a => a.id === blocko[i])[0].x - arrowhelp.x + 5) + ' ' + (this.paddingy / 2) + 'L5 ' + (this.paddingy / 2) + 'L5 ' + arrowy + '" stroke="#C5CCD0" stroke-width="2px"/>
                    <path d="M0 ' + (arrowy - 5) + 'H10L5 ' + arrowy + 'L0 ' + (arrowy - 5) + 'Z" fill="#C5CCD0"/>
                </svg>
            </div>
        )

    }
}
