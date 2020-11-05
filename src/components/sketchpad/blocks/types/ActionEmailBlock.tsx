import actionIcon from "../../../../assets/images/action.svg";
import React from "react";

function ActionEmailBlock() {
  return (
    <div className="blockelem create-flowy noselect">
      <input type="hidden" name='blockelemtype' className="blockelemtype" value="7"/>
      <div className="blockin">
        <div className="blockico">
          <img src={actionIcon} alt=""/>
        </div>
        <div className="blocktext">
          <p className="blocktitle">E-mail Action</p>
          <p className="blockdesc">Email Communication will be sent out based on the action definition</p>
        </div>
      </div>
    </div>
  );
}

export default ActionEmailBlock;