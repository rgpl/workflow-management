import { 
    EuiPopover,
    EuiListGroup,
    EuiListGroupItem
} from '@elastic/eui';
import React, { Component } from 'react';

import more from '../assets/more.svg';

type PopProp = {
    id:number;
    openConfigurator:()=> void;
};
type PopState= {
    isPopoverOpen:boolean
};

export default class FlowPop extends Component<PopProp,PopState> {

    state:PopState = {
        isPopoverOpen:false
    }

    constructor(props:PopProp) {
        super(props);

        this.state = {
            isPopoverOpen: false,
        };
    }

    onButtonClick = ()=> {
        console.log("calling popover")
        this.setState({
            isPopoverOpen: !this.state.isPopoverOpen,
        });
    }

    closePopover = () => {
        console.log("closing pop")
        this.setState({
            isPopoverOpen: false,
        });
    }

    render() {
        const { openConfigurator } = this.props;
        const button = (
            <div className="blockyright" onClick={this.onButtonClick}>
                <img src={more} alt="" />
            </div>
        );

        return (
        <EuiPopover
        ownFocus
            button={button}
            isOpen={this.state.isPopoverOpen}
            closePopover={this.closePopover}
            anchorPosition="rightCenter"
            panelPaddingSize="none">
            <EuiListGroup>
                
                <EuiListGroupItem 
                    id="confCard" 
                    iconType="gear" 
                    onClick={openConfigurator}
                    label="Configure"  
                    size="m"
                />
                

                
                <EuiListGroupItem
                    id="deleteCard"
                    iconType="trash"
                    onClick={() => {}}
                    label="Delete"
                    size="m"
                />
                
            </EuiListGroup>
        </EuiPopover>
        );
    }
}
