import React from "react";
import timeIcon from "../../../../assets/images/time.svg";

function TimeHasPassedBlock() {
  return (
    <div className="blockelem create-flowy noselect">
      <input type="hidden" name='blockelemtype' className="blockelemtype" value="3"/>
      <div className="blockin">
        <div className="blockico">
          <img src={timeIcon} alt=""/>
        </div>
        <div className="blocktext">
          <p className="blocktitle">Time has passed</p>
          <p className="blockdesc">Triggers after a specified amount of time</p>
        </div>
      </div>
    </div>
  );
}

export default TimeHasPassedBlock;