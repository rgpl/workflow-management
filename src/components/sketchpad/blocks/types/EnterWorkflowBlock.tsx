import eyeIcon from "../../../../assets/images/eye.svg";
import React from "react";

function EnterWorkflowBlock() {
  return (
    <div className="blockelem create-flowy noselect">
      <input type="hidden" name='blockelemtype' className="blockelemtype" value="1"/>
      <div className="blockin">
        <div className="blockico">
          <img src={eyeIcon} alt=""/>
        </div>
        <div className="blocktext">
          <p className="blocktitle">Enter Workflow</p>
          <p className="blockdesc">Triggers when somebody visits a specified page</p>
        </div>
      </div>
    </div>
  );
}

export default EnterWorkflowBlock;
