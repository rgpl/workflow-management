import React, { useCallback, useState } from 'react';

import {
  EuiButtonEmpty,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlyout,
  EuiFlyoutBody,
  EuiFlyoutFooter,
  EuiFlyoutHeader,
  EuiForm,
  EuiFormRow,
  EuiSpacer,
  EuiText,
  EuiTitle,
} from '@elastic/eui';

import SuperSelectComplex from './SuperSelectComplex';
import { Observer } from "mobx-react-lite";
import { INode } from "@artemantcev/react-flow-chart";
import { useChartStore } from "../../../store/ChartStore";

type FlyProps = {
  node: INode;
  isVisible: boolean;
}

function Flyout(props: FlyProps) {
  const chartStore = useChartStore();

  const findValueByPrefix: any = (object: any, prefix: string) => {
    for (let property in object) {
      if (object.hasOwnProperty(property) &&
        property.toString().startsWith(prefix)) {
        return object[property];
      }
    }
  }

  const findFullKeyByPrefix = (object: any, prefix: string) => {
    for (let property in object) {
      if (object.hasOwnProperty(property) &&
        property.toString().startsWith(prefix)) {
        return property;
      }
    }

    return "";
  }

  const [isFlyoutVisible, setIsFlyoutVisible] = useState(props.isVisible);

  const closeFlyout = useCallback(() => {
    setIsFlyoutVisible(false);
    chartStore.removeSelected();
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
              />
            </EuiFormRow>
            { props.node.properties["customizablePortsCount"] >= 1 ?
              <EuiFormRow label="Color of port #1">
                <input type="text" name="color_port_1" defaultValue={findValueByPrefix(props.node.ports, "portOutput1").properties.linkColor} onBlur={(e) => {
                  chartStore.chart.nodes[props.node.id].ports[findFullKeyByPrefix(props.node.ports, "portOutput1")].properties.linkColor = e.target.value;
                }}/>
              </EuiFormRow> : ""
            }
            {props.node.properties["customizablePortsCount"] >= 2 ?
              <EuiFormRow label="Color of port #2">
                <input type="text" name="color_port_2" defaultValue={findValueByPrefix(props.node.ports, "portOutput2").properties.linkColor} onBlur={(e) => {
                  chartStore.chart.nodes[props.node.id].ports[findFullKeyByPrefix(props.node.ports, "portOutput2")].properties.linkColor = e.target.value;
                }}/>
              </EuiFormRow> : ""
            }
            {props.node.properties["customizablePortsCount"] >= 3 ?
              <EuiFormRow label="Color of port #3">
                <input type="text" name="color_port_3" defaultValue={findValueByPrefix(props.node.ports, "portOutput3").properties.linkColor} onBlur={(e) => {
                  chartStore.chart.nodes[props.node.id].ports[findFullKeyByPrefix(props.node.ports, "portOutput3")].properties.linkColor = e.target.value;
                }}/>
              </EuiFormRow> : ""
            }
            {props.node.properties["customizablePortsCount"] >= 4 ?
              <EuiFormRow label="Color of port #4">
                <input type="text" name="color_port_4" defaultValue={findValueByPrefix(props.node.ports, "portOutput4").properties.linkColor} onBlur={(e) => {
                  chartStore.chart.nodes[props.node.id].ports[findFullKeyByPrefix(props.node.ports, "portOutput4")].properties.linkColor = e.target.value;
                }}/>
              </EuiFormRow> : ""
            }
            {props.node.properties["customizablePortsCount"] >= 5 ?
              <EuiFormRow label="Color of port #5">
                <input type="text" name="color_port_5" defaultValue={findValueByPrefix(props.node.ports, "portOutput5").properties.linkColor} onBlur={(e) => {
                  chartStore.chart.nodes[props.node.id].ports[findFullKeyByPrefix(props.node.ports, "portOutput5")].properties.linkColor = e.target.value;
                }}/>
              </EuiFormRow> : ""
            }
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

