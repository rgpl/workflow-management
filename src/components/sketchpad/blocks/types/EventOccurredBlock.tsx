import React from "react";
import actionIcon from "../../../../assets/images/action.svg";

function EventOccurredBlock() {
  return (
    <div className="blockelem create-flowy noselect">
      <input type="hidden" name='blockelemtype' className="blockelemtype" value="2"/>
      <div className="blockin">
        <div className="blockico">
          <img src={actionIcon} alt=""/>
        </div>
        <div className="blocktext">
          <p className="blocktitle">Event occurred</p>
          <p className="blockdesc">Triggers when somebody performs a specified action</p>
        </div>
      </div>
    </div>
  );
}

export default EventOccurredBlock;
