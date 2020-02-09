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
    EuiPageContent,
    EuiTabbedContent,
} from '@elastic/eui';
import './draftbench.css';
import grabme from './assets/grabme.svg';
import eye from './assets/eye.svg';
import action from './assets/action.svg';
import time from './assets/time.svg';
import error from './assets/error.svg';
import database from './assets/database.svg';
import twitter from './assets/twitter.svg';
import log from './assets/log.svg';
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
                                    <img src={eye}/>
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
                                <img src={grabme}/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src={action}/>
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
                                <img src={grabme}/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src={time}/>
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
                                <img src={grabme}/>
                            </div>
                            <div className="blockin">
                                <div className="blockico">
                                    <span></span>
                                    <img src={error}/>
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
                        <div class="blockelem create-flowy noselect">
                            <input type="hidden" name="blockelemtype" class="blockelemtype" value="5"/>
                            <div class="grabme">
                                <img src={grabme}/>
                            </div>
                            <div class="blockin">

                                <div class="blockico">
                                    <span></span>
                                    <img src={database}/>
                                </div>
                                <div class="blocktext">
                                    <p class="blocktitle">New database entry</p>
                                    <p class="blockdesc">Adds a new entry to a specified database</p>
                                </div>
                            </div>
                        </div>
                        <div class="blockelem create-flowy noselect">
                            <input type="hidden" name="blockelemtype" class="blockelemtype" value="6"/>
                            <div class="grabme">
                                <img src={grabme}/>
                            </div>
                            <div class="blockin">
                                <div class="blockico">
                                    <span></span>
                                    <img src={database}/>
                                </div>
                                <div class="blocktext">
                                    <p class="blocktitle">Update database</p>
                                    <p class="blockdesc">Edits and deletes database entries and properties</p>
                                </div>
                            </div>
                        </div>
                        <div class="blockelem create-flowy noselect">
                            <input type="hidden" name="blockelemtype" class="blockelemtype" value="7"/>
                            <div class="grabme">
                                <img src={grabme}/>
                            </div>
                            <div class="blockin">
                                <div class="blockico">
                                    <span></span>
                                    <img src={action}/>
                                </div>
                                <div class="blocktext">
                                    <p class="blocktitle">Perform an action</p>
                                    <p class="blockdesc">Performs or edits a specified action</p>
                                </div>
                            </div>
                        </div>
                        <div class="blockelem create-flowy noselect">
                            <input type="hidden" name="blockelemtype" class="blockelemtype" value="8"/>
                            <div class="grabme">
                                <img src={grabme}/>
                            </div>
                            <div class="blockin">
                                <div class="blockico">
                                    <span></span>
                                    <img src={twitter}/>
                                </div>
                                <div class="blocktext">
                                    <p class="blocktitle">Make a tweet</p>
                                    <p class="blockdesc">Makes a tweet with a specified query</p>
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
                        <div class="blockelem create-flowy noselect">
                            <input type="hidden" name="blockelemtype" class="blockelemtype" value="9"/>
                            <div class="grabme">
                                <img src={grabme}/>
                            </div>
                            <div class="blockin">
                                <div class="blockico">
                                    <span></span>
                                    <img src={log}/>
                                </div>
                                <div class="blocktext">
                                    <p class="blocktitle">Add new log entry</p>
                                    <p class="blockdesc">Adds a new log entry to this project</p>
                                </div>
                            </div>
                        </div>
                        <div class="blockelem create-flowy noselect">
                            <input type="hidden" name="blockelemtype" class="blockelemtype" value="10"/>
                            <div class="grabme">
                                <img src={grabme}/>
                            </div>
                            <div class="blockin">
                                <div class="blockico">
                                    <span></span>
                                    <img src={log}/>
                                </div>
                                <div class="blocktext">
                                    <p class="blocktitle">Update logs</p>
                                    <p class="blockdesc">Edits and deletes log entries in this project</p>
                                </div>
                                </div>
                            </div>
                            <div class="blockelem create-flowy noselect">
                                <input type="hidden" name="blockelemtype" class="blockelemtype" value="11"/>
                                <div class="grabme">
                                    <img src={grabme}/>
                                </div>
                                <div class="blockin">
                                <div class="blockico">
                                    <span></span>
                                    <img src={error}/>
                                </div>
                                <div class="blocktext">
                                    <p class="blocktitle">Prompt an error</p>
                                    <p class="blockdesc">Triggers a specified error</p>
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
            <EuiPage className="full-height">
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
                                initialSelectedTab={this.tabs[0]}
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
