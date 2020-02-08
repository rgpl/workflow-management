import React from 'react';
import {
    EuiPage,
    EuiPageBody,
    EuiHeader,
    EuiHeaderSection,
    EuiHeaderSectionItem,
    EuiIcon,
    EuiFlexItem,
    EuiFlexGroup,
    EuiSideNav,
    EuiPageContent,
    EuiPageContentHeader,
    EuiTitle,
    EuiPageContentBody,
    EuiPageContentHeaderSection,
    EuiTabbedContent,
    EuiText,
    EuiSpacer
} from '@elastic/eui';
import './draftbench.css';
import grabme from './assets/grabme.svg';
import SketchPad from './sketchpad';

export default class Draftbench extends React.Component {

    constructor() {
        super();
        this.tabs= [
            {
                id:'triggers',
                name:'Triggers',
                content:(
                    <div id="blocklist">
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="1"/>
                            <div className="grabme">
                                <img src={grabme}/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/eye.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">New visitor</p>
                                    <p className="blockdesc">Triggers when somebody visits a specified page</p>
                                </div>
                            </div>
                        </div>
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="2"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/action.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">Action is performed</p>
                                    <p className="blockdesc">Triggers when somebody performs a specified action</p>
                                </div>
                            </div>
                        </div>
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="3"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/time.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">Time has passed</p>
                                    <p className="blockdesc">Triggers after a specified amount of time</p>
                                </div>
                            </div>
                        </div>
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="4"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/error.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">Error prompt</p>
                                    <p className="blockdesc">Triggers when a specified error happens</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                id:'actions',
                name:'Actions',
                content:(
                    <div id="blocklist">
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="1"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/eye.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">New visitor</p>
                                    <p className="blockdesc">Triggers when somebody visits a specified page</p>
                                </div>
                            </div>
                        </div>
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="2"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/action.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">Action is performed</p>
                                    <p className="blockdesc">Triggers when somebody performs a specified action</p>
                                </div>
                            </div>
                        </div>
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="3"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/time.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">Time has passed</p>
                                    <p className="blockdesc">Triggers after a specified amount of time</p>
                                </div>
                            </div>
                        </div>
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="4"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/error.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">Error prompt</p>
                                    <p className="blockdesc">Triggers when a specified error happens</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            },
            {
                id:'loggers',
                name:'Loggers',
                content:(
                    <div id="blocklist">
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="1"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/eye.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">New visitor</p>
                                    <p className="blockdesc">Triggers when somebody visits a specified page</p>
                                </div>
                            </div>
                        </div>
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="2"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/action.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">Action is performed</p>
                                    <p className="blockdesc">Triggers when somebody performs a specified action</p>
                                </div>
                            </div>
                        </div>
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="3"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/time.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">Time has passed</p>
                                    <p className="blockdesc">Triggers after a specified amount of time</p>
                                </div>
                            </div>
                        </div>
                        <div className="blockelem create-flowy noselect">
                            <input type="hidden" name='blockelemtype' className="blockelemtype" value="4"/>
                            <div className="grabme">
                                <img src="assets/grabme.svg"/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src="assets/error.svg"/>
                                </div>
                                <div className="blocktext">
                                    <p className="blocktitle">Error prompt</p>
                                    <p className="blockdesc">Triggers when a specified error happens</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
        ];
    }


    render(){
        

        return(
            <EuiPage>
                <EuiPageBody>
                    <EuiHeader>
                        <EuiHeaderSection grow={false}>
                            <EuiHeaderSectionItem>
                                <EuiFlexItem className="db-back-icon">
                                    <EuiIcon type="arrowLeft" size="l" />
                                </EuiFlexItem>
                            </EuiHeaderSectionItem>
                        </EuiHeaderSection>
                    </EuiHeader>
                    <EuiFlexGroup>
                        <EuiFlexItem grow={false}>
                            
                            <EuiTabbedContent
                                tabs={this.tabs}
                                initialSelectedTab={this.tabs[1]}
                                autoFocus="selected"
                                onTabClick={tab => {
                                console.log('clicked tab', tab);
                                }}
                            />
                            
                        </EuiFlexItem>
                        <EuiFlexItem>
                            <EuiPageContent>
                                <SketchPad></SketchPad>
                            </EuiPageContent>
                        </EuiFlexItem>
                    </EuiFlexGroup>
                </EuiPageBody>
            </EuiPage>
        )
    }
}
