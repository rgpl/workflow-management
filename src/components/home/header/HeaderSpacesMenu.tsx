import React, {Component, useState} from 'react';

import {
  EuiHeaderSectionItemButton,
  EuiPopover,
  EuiButton,
  EuiAvatar,
  EuiSelectable,
  EuiPopoverTitle,
  EuiPopoverFooter,
} from '@elastic/eui';
import { Fragment } from 'react-is';

function HeaderSpacesMenu() {
  let spaces: any = [
    {
      label: 'Sales team',
      prepend: <EuiAvatar type="space" name="Sales Team" size="s" />,
      checked: 'on',
    },
    {
      label: 'Engineering',
      prepend: <EuiAvatar type="space" name="Engineering" size="s" />,
    },
    {
      label: 'Security',
      prepend: <EuiAvatar type="space" name="Security" size="s" />,
    },
    {
      label: 'Default',
      prepend: <EuiAvatar type="space" name="Default" size="s" />,
    },
  ];

  let additionalSpaces: any = [
    {
      label: 'Sales team 2',
      prepend: <EuiAvatar type="space" name="Sales Team 2" size="s" />,
    },
    {
      label: 'Engineering 2',
      prepend: <EuiAvatar type="space" name="Engineering 2" size="s" />,
    },
    {
      label: 'Security 2',
      prepend: <EuiAvatar type="space" name="Security 2" size="s" />,
    },
    {
      label: 'Default 2',
      prepend: <EuiAvatar type="space" name="Default 2" size="s" />,
    },
  ];

  const [stateSpaces, setStateSpaces] = useState(spaces);
  const [stateSelectedSpace, setStateSelectedSpace] = useState(
    spaces.filter((option: { checked: any; }) => option.checked)[0]
  );
  const [stateIsOpen, setStateIsOpen] = useState(false);

  const isListExtended = () => {
    return stateSpaces.length > 4;
  };

  const onMenuButtonClick = () => {
    setStateIsOpen(!stateIsOpen);
  };

  const closePopover = () => {
    setStateIsOpen(false);
  };

  const onChange = (options: any[]) => {
    setStateSpaces(options);
    setStateSelectedSpace(options.filter((option: { checked: any; }) => option.checked)[0]);
    setStateIsOpen(false);
  };

  const addMoreSpaces = () => {
    setStateSpaces(spaces.concat(additionalSpaces));
  };

  const button = (
    <EuiHeaderSectionItemButton
      aria-controls="headerSpacesMenuList"
      aria-expanded={stateIsOpen}
      aria-haspopup="true"
      aria-label="Apps menu"
      onClick={onMenuButtonClick}>
      {stateSelectedSpace.prepend}
    </EuiHeaderSectionItemButton>
  );

  return (
    <EuiPopover
      id="headerSpacesMenu"
      ownFocus
      button={button}
      isOpen={stateIsOpen}
      anchorPosition="downLeft"
      closePopover={closePopover}
      panelPaddingSize="none">
      // @ts-ignore
      <EuiSelectable
        searchable={isListExtended()}
        searchProps={{
          placeholder: 'Find a space',
          compressed: true,
        }}
        options={spaces}
        singleSelection="always"
        style={{ width: 300 }}
        onChange={onChange}
        listProps={{
          rowHeight: 40,
          showIcons: false,
        }}>
        {(list, search) => (
          // @ts-ignore
          <Fragment>
            <EuiPopoverTitle>{search || 'Your spaces'}</EuiPopoverTitle>
            {list}
            <EuiPopoverFooter>
              <EuiButton
                size="s"
                fullWidth
                onClick={addMoreSpaces}
                disabled={isListExtended()}>
                Add more spaces
              </EuiButton>
            </EuiPopoverFooter>
          </Fragment>
        )}
      </EuiSelectable>
    </EuiPopover>
  );
}

export default HeaderSpacesMenu;
