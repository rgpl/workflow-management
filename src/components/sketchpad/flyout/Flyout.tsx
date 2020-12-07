import React, { useCallback, useState } from 'react';

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
import { Observer } from "mobx-react-lite";
import {INode} from "@artemantcev/react-flow-chart";
import {useChartStore} from "../../../store/ChartStore";

type FlyProps = {
  node: INode;
  isVisible: boolean;
}

function Flyout(props: FlyProps) {
  const [isFlyoutVisible, setIsFlyoutVisible] = useState(props.isVisible);
  const [isSwitchChecked, setIsSwitchChecked] = useState(true);
  const [colorPort1, setColorPort1] = useState("cornflowerblue");
  const [colorPort2, setColorPort2] = useState("cornflowerblue");
  const [colorPort3, setColorPort3] = useState("cornflowerblue");
  const [colorPort4, setColorPort4] = useState("cornflowerblue");
  const [colorPort5, setColorPort5] = useState("cornflowerblue");
  const chartStore = useChartStore();

  const onSwitchChange = () => {
    setIsSwitchChecked(!isSwitchChecked);
  };

  const closeFlyout = useCallback(() => {
    setIsFlyoutVisible(false);
    chartStore.removeSelected();
  }, []);

  const showFlyout = useCallback(() => {
    setIsFlyoutVisible(true);
  }, []);

  if (!isFlyoutVisible) {
    return <div/>;
  }

  return (
    <Observer>{() =>
      <EuiFlyout
        size="l"
        onClose={closeFlyout}
        hideCloseButton
        aria-labelledby="flyoutComplicatedTitle">
        <EuiFlyoutHeader hasBorder>
          <EuiTitle size="m">
            <h2 id="flyoutComplicatedTitle">{props.node.type}</h2>
          </EuiTitle>
          <EuiSpacer size="s"/>
          <EuiText color="subdued">
            <p>
              node id: {props.node.id}
            </p>
          </EuiText>

        </EuiFlyoutHeader>
        <EuiFlyoutBody>
          <EuiSpacer size="m"/>
          <EuiForm>
            <EuiFormRow label="Select a number of outputs for the block">
              <SuperSelectComplex
                node={props.node}
                colorPorts={{
                  1: colorPort1,
                  2: colorPort2,
                  3: colorPort3,
                  4: colorPort4,
                  5: colorPort5,
                }}
              />
            </EuiFormRow>
            <EuiFormRow label="Color of port #1">
              <input type="text" name="color_port_1" onBlur={ (e) => { setColorPort1(e.target.value) }} />
            </EuiFormRow>
            <EuiFormRow label="Color of port #2">
              <input type="text" name="color_port_2" onBlur={ (e) => { setColorPort2(e.target.value) }} />
            </EuiFormRow>
            <EuiFormRow label="Color of port #3">
              <input type="text" name="color_port_3" onBlur={ (e) => { setColorPort3(e.target.value) }} />
            </EuiFormRow>
            <EuiFormRow label="Color of port #4">
              <input type="text" name="color_port_4" onBlur={ (e) => { setColorPort4(e.target.value) }} />
            </EuiFormRow>
            <EuiFormRow label="Color of port #5">
              <input type="text" name="color_port_5" onBlur={ (e) => { setColorPort5(e.target.value) }} />
            </EuiFormRow>
          </EuiForm>
          <EuiSpacer/>
        </EuiFlyoutBody>
        <EuiFlyoutFooter>
          <EuiFlexGroup justifyContent="spaceBetween">
            <EuiFlexItem grow={false}>
              <EuiButtonEmpty
                iconType="cross"
                onClick={closeFlyout}
                flush="left">
                Close
              </EuiButtonEmpty>
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiFlyoutFooter>
      </EuiFlyout>
    }</Observer>
  );
}

export default Flyout;

