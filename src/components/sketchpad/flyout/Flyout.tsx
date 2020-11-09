import React, {Component, useCallback, useState} from 'react';

import {
  EuiButton,
  EuiButtonEmpty,
  EuiCodeBlock,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiPopover,
  EuiSpacer,
  EuiTab,
  EuiTabs,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import SuperSelectComplex from './SuperSelectComplex';

type FlyProps = {
  closeSettings: () => void;
}

function Flyout(props: FlyProps) {
  let tabs: Array<any> = [
    {
      id: '1',
      name: 'Tab 1',
    },
    {
      id: '2',
      name: 'Tab 2',
    },
  ];

  const [isFlyoutVisible, setIsFlyoutVisible] = useState(false);
  const [isSwitchChecked, setIsSwitchChecked] = useState(true);
  const [selectedTabId, setSelectedTabId] = useState('1');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onSwitchChange = () => {
    setIsSwitchChecked(!isSwitchChecked);
  };

  const closeFlyout = useCallback(() => {
    setIsFlyoutVisible(false);
  }, []);

  const showFlyout = useCallback(() => {
    setIsFlyoutVisible(true);
  }, []);

  const closePopover = () => {
    setIsPopoverOpen(false);
  };

  const togglePopover = () => {
    setIsPopoverOpen(!isPopoverOpen);
  };

  const onSelectedTabChanged = (id: string) => {
    setSelectedTabId(id);
  };

  const renderTabs = () => {
    return tabs.map((tab, index) => (
      <EuiTab
        onClick={() => onSelectedTabChanged(tab.id)}
        isSelected={tab.id === selectedTabId}
        key={index}>
        {tab.name}
      </EuiTab>
    ));
  }

  const flyoutContent = (
    <EuiText>
      <p>
        Far out in the uncharted backwaters of the unfashionable end of the
        western spiral arm of the Galaxy lies a small unregarded yellow sun.
      </p>

      <p>
        Orbiting this at a distance of roughly ninety-two million miles is an
        utterly insignificant little blue green planet whose ape- descended
        life forms are so amazingly primitive that they still think digital
        watches are a pretty neat idea.
      </p>

      <ul>
        <li>List item one</li>
        <li>List item two</li>
        <li>Dolphins</li>
      </ul>

      <p>
        This planet has - or rather had - a problem, which was this: most of
        the people living on it were unhappy for pretty much of the time. Many
        solutions were suggested for this problem, but most of these were
        largely concerned with the movements of small green pieces of paper,
        which is odd because on the whole it was not the small green pieces of
        paper that were unhappy.
      </p>

      <h2>This is Heading Two</h2>

      <ol>
        <li>Number one</li>
        <li>Number two</li>
        <li>Dolphins again</li>
      </ol>

      <p>
        But the dog wasn&rsquo;t lazy, it was just practicing mindfulness, so
        it had a greater sense of life-satisfaction than that fox with all its
        silly jumping.
      </p>

      <p>
        And from the fox&rsquo;s perspective, life was full of hoops to jump{' '}
        <em>through</em>, low-hanging fruit to jump <em>for</em>, and dead car
        batteries to jump-<em>start</em>.
      </p>

      <h3>This is Heading Three</h3>

      <p>
        So it thought the dog was making a poor life choice by focusing so
        much on mindfulness. What if its car broke down?
      </p>
    </EuiText>
  );

  const htmlCode = `<!--I'm an example of HTML-->
                    <div>
                    asdf
                    </div>
                    `;
  const { closeSettings } = props;

  return (
    <EuiFlyout
      onClose={closeFlyout}
      hideCloseButton
      aria-labelledby="flyoutComplicatedTitle">
      <EuiFlyoutHeader hasBorder>
        <EuiTitle size="m">
          <h2 id="flyoutComplicatedTitle">Flyout header</h2>
        </EuiTitle>
        <EuiSpacer size="s" />
        <EuiText color="subdued">
          <p>
            Put navigation items in the header, and cross tab actions in a
            footer.
          </p>
        </EuiText>
        <EuiTabs style={{ marginBottom: '-25px' }}>
          {renderTabs()}
        </EuiTabs>
      </EuiFlyoutHeader>
      <EuiFlyoutBody>
        <EuiPopover
          closePopover={closePopover}
          button={
            <EuiButton onClick={togglePopover}>
              Even popovers can be included
            </EuiButton>
          }
          isOpen={isPopoverOpen}>
          <p>
            This is the popover content, notice how it can overflow the
            flyout!
          </p>
        </EuiPopover>
        <EuiSpacer size="m" />
        <EuiForm>
          <EuiFormRow label="A SuperSelect field">
            <SuperSelectComplex />
          </EuiFormRow>
        </EuiForm>
        <EuiSpacer />
        {flyoutContent}
        <EuiCodeBlock language="html">{htmlCode}</EuiCodeBlock>
      </EuiFlyoutBody>
      <EuiFlyoutFooter>
        <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiButtonEmpty
              iconType="cross"
              onClick={closeSettings}
              flush="left">
              Close
            </EuiButtonEmpty>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton onClick={closeFlyout} fill>
              Save
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </EuiFlyoutFooter>
    </EuiFlyout>
  );
}

export default Flyout;

