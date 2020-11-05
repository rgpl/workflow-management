import actionIcon from "../../../../assets/images/action.svg";
import React from "react";

function ActionPushBlock() {
  return (
    <div className="blockelem create-flowy noselect">
      <input type="hidden" name='blockelemtype' className="blockelemtype" value="5"/>
      <div className="blockin">
        <div className="blockico">
          <img src={actionIcon} alt=""/>
        </div>
        <div className="blocktext">
          <p className="blocktitle">Push Action</p>
          <p className="blockdesc">Push notification based on the action definition</p>
        </div>
      </div>
    </div>
  );
}

export default ActionPushBlock;