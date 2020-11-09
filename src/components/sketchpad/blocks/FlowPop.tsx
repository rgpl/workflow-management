import {
  EuiPopover,
  EuiListGroup,
  EuiListGroupItem
} from '@elastic/eui';
import React, {Component, useState} from 'react';

import more from '../../../assets/images/more.svg';

type PopProp = {
  id: number;
  openConfigurator: () => void;
  deleteBlock: (id: number) => void;
};

function FlowPop(props: PopProp) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const { id, deleteBlock, openConfigurator } = props;

  const onButtonClick = () => {
    setIsPopoverOpen(!isPopoverOpen);
  }

  const closePopover = () => {
    setIsPopoverOpen(false);
  }

  const triggerDelete = () => {
    deleteBlock(id);
  }

  const button = (
    <div className="blockyright" onClick={onButtonClick}>
      <img src={more} alt="" />
    </div>
  );

  return (
    <EuiPopover
      ownFocus
      button={button}
      isOpen={isPopoverOpen}
      closePopover={closePopover}
      anchorPosition="rightCenter"
      panelPaddingSize="none">
      <EuiListGroup>
        <EuiListGroupItem
          id="confCard"
          iconType="gear"
          onClick={openConfigurator}
          label="Configure"
          size="m"
        />
        <EuiListGroupItem
          id="deleteCard"
          iconType="trash"
          onClick={triggerDelete}
          label="Delete"
          size="m"
        />
      </EuiListGroup>
    </EuiPopover>
  );
}

export default FlowPop;
