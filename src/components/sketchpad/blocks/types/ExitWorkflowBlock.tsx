import React from "react";
import errorIcon from "../../../../assets/images/error.svg";

function ExitWorkflowBlock() {
  return (
    <div className="blockelem create-flowy noselect">
      <input type="hidden" name='blockelemtype' className="blockelemtype" value="4"/>
      <div className="blockin">
        <div className="blockico">
          <img src={errorIcon} alt=""/>
        </div>
        <div className="blocktext">
          <p className="blocktitle">Exit Workflow</p>
          <p className="blockdesc">Triggers when a specified error happens</p>
        </div>
      </div>
    </div>
  );
}

export default ExitWorkflowBlock;
