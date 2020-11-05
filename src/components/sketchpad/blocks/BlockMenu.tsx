import React from 'react';

import EnterWorkflowBlock from "./types/EnterWorkflowBlock";
import EventOccurredBlock from "./types/EventOccurredBlock";
import ExitWorkflowBlock from "./types/ExitWorkflowBlock";
import TimeHasPassedBlock from "./types/TimeHasPassedBlock";
import ActionPushBlock from "./types/ActionPushBlock";
import ActionSMSBlock from "./types/ActionSMSBlock";
import ActionEmailBlock from "./types/ActionEmailBlock";
import ActionWebApiBlock from "./types/ActionWebApiBlock";

function BlockMenu() {
  return (
    <div className="blocklist">
      <EnterWorkflowBlock />
      <EventOccurredBlock />
      <TimeHasPassedBlock />
      <ExitWorkflowBlock />
      <ActionPushBlock />
      <ActionSMSBlock />
      <ActionEmailBlock />
      <ActionWebApiBlock />
    </div>
  )
}

export default BlockMenu;
