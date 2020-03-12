import { EuiPopover, EuiButton } from '@elastic/eui';
import React, { Component } from 'react';

import more from '../assets/more.svg';

type PopState= {
    isPopoverOpen:boolean
};

export default class FlowPop extends Component<any,PopState> {

    state:PopState = {
        isPopoverOpen:false
    }

    constructor(props:any) {
        super(props);

        this.state = {
            isPopoverOpen: false,
        };
    }

    onButtonClick() {
        this.setState({
            isPopoverOpen: !this.state.isPopoverOpen,
        });
    }

    closePopover() {
        this.setState({
            isPopoverOpen: false,
        });
    }

    render() {
        const button = (
            <div className="blockyright" onClick={this.onButtonClick.bind(this)}>
                <img src={more} alt="" />
            </div>
        );

        return (
        <EuiPopover
            id="popover"
            button={button}
            isOpen={this.state.isPopoverOpen}
            closePopover={this.closePopover.bind(this)}
            anchorPosition="rightCenter">
            <div style={{ width: '150px' }}>
                Popover content that&rsquo;s wider than the default width
            </div>
        </EuiPopover>
        );
    }
}
