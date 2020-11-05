import actionIcon from "../../../../assets/images/action.svg";
import React from "react";

function ActionWebApiBlock() {
  return (
    <div className="blockelem create-flowy noselect">
      <input type="hidden" name='blockelemtype' className="blockelemtype" value="8"/>
      <div className="blockin">
        <div className="blockico">
          <img src={actionIcon} alt=""/>
        </div>
        <div className="blocktext">
          <p className="blocktitle">Web Api Action</p>
          <p className="blockdesc">Web Api will be sent out based on the action definition</p>
        </div>
      </div>
    </div>
  );
}

export default ActionWebApiBlock;