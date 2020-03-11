import React from 'react';
import {
    EuiTabbedContent
} from '@elastic/eui';


import eye from '../assets/eye.svg';
import action from '../assets/action.svg';
import time from '../assets/time.svg';
import error from '../assets/error.svg';
import database from '../assets/database.svg';
import twitter from '../assets/twitter.svg';
import log from '../assets/log.svg';

const tabs= [
    {
        id:'triggers',
        name:'Triggers',
        content:(
            <div className="blocklist">
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name='blockelemtype' className="blockelemtype" value="1"/>
                    <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={eye} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Enter Workflow</p>
                            <p className="blockdesc">Triggers when somebody visits a specified page</p>
                        </div>
                    </div>
                </div>
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name='blockelemtype' className="blockelemtype" value="2"/>
                    <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={action} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Action is performed</p>
                            <p className="blockdesc">Triggers when somebody performs a specified action</p>
                        </div>
                    </div>
                </div>
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name='blockelemtype' className="blockelemtype" value="3"/>
                    <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={time} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Time has passed</p>
                            <p className="blockdesc">Triggers after a specified amount of time</p>
                        </div>
                    </div>
                </div>
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name='blockelemtype' className="blockelemtype" value="4"/>
                    <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={error} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Exit Workflow</p>
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
            <div className="blocklist">
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name="blockelemtype" className="blockelemtype" value="5"/>
                    <div className="blockin">

                        <div className="blockico">
                            <span></span>
                            <img src={database} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">New database entry</p>
                            <p className="blockdesc">Adds a new entry to a specified database</p>
                        </div>
                    </div>
                </div>
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name="blockelemtype" className="blockelemtype" value="6"/>
                    <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={database} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Update database</p>
                            <p className="blockdesc">Edits and deletes database entries and properties</p>
                        </div>
                    </div>
                </div>
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name="blockelemtype" className="blockelemtype" value="7"/>
                    <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={action} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Perform an action</p>
                            <p className="blockdesc">Performs or edits a specified action</p>
                        </div>
                    </div>
                </div>
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name="blockelemtype" className="blockelemtype" value="8"/>
                    <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={twitter} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Make a tweet</p>
                            <p className="blockdesc">Makes a tweet with a specified query</p>
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
            <div className="blocklist">
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name="blockelemtype" className="blockelemtype" value="9"/>
                    <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={log} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Add new log entry</p>
                            <p className="blockdesc">Adds a new log entry to this project</p>
                        </div>
                    </div>
                </div>
                <div className="blockelem create-flowy noselect">
                    <input type="hidden" name="blockelemtype" className="blockelemtype" value="10"/>
                    <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={log} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Update logs</p>
                            <p className="blockdesc">Edits and deletes log entries in this project</p>
                        </div>
                        </div>
                    </div>
                    <div className="blockelem create-flowy noselect">
                        <input type="hidden" name="blockelemtype" className="blockelemtype" value="11"/>
                        <div className="blockin">
                        <div className="blockico">
                            <span></span>
                            <img src={error} alt=""/>
                        </div>
                        <div className="blocktext">
                            <p className="blocktitle">Prompt an error</p>
                            <p className="blockdesc">Triggers a specified error</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
];

const Blocks = (props) => {
    return(
        <EuiTabbedContent
            tabs={tabs}
            initialSelectedTab={tabs[0]}
            onTabClick={tab => {}}
            expand={true}
            size="s"
        />
    )
};

export default Blocks;
