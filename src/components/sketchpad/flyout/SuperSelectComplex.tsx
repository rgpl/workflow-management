import React, {Component, Fragment, useState} from 'react';
import { EuiSuperSelect, EuiText } from '@elastic/eui';
import {PORT_DEFAULT_COLOR, PORT_ID_INPUT, useChartStore} from "../../../store/ChartStore";
import {INode} from "@artemantcev/react-flow-chart";
import {toJS} from "mobx";
import v4 from "uuid/v4";
import {ILink} from "@artemantcev/react-flow-chart/src/types/chart";
import {IPosition} from "@artemantcev/react-flow-chart/src/types/generics";
import PortDropUtils from "../service/PortDropUtils";
import TreeRearranger from "../service/TreeRearranger";

interface SuperSelectProps {
  node: INode;
}

interface RemovedLinkInfo {
  toNodeId: string|undefined,
  toPortId: string|undefined
}

function SuperSelectComplex(props: SuperSelectProps) {
  const chartStore = useChartStore();

  let options: Array<any> = [
    {
      value: '1',
      inputDisplay: '1',
      dropdownDisplay: (
        <Fragment>
          <strong>1</strong>
        </Fragment>
      ),
    },
    {
      value: '2',
      inputDisplay: '2',
      dropdownDisplay: (
        <Fragment>
          <strong>2</strong>
        </Fragment>
      ),
    },
    {
      value: '3',
      inputDisplay: '3',
      dropdownDisplay: (
        <Fragment>
          <strong>3</strong>
        </Fragment>
      ),
    },
    {
      value: '4',
      inputDisplay: '4',
      dropdownDisplay: (
        <Fragment>
          <strong>4</strong>
        </Fragment>
      ),
    },
    {
      value: '5',
      inputDisplay: '5',
      dropdownDisplay: (
        <Fragment>
          <strong>5</strong>
        </Fragment>
      ),
    },
  ];

  const [value, setValue] = useState(props.node.properties["customizablePortsCount"].toString());

  // TODO: move the code or rename the select component more specifically
  const onChange = (value: string) => {
    setValue(value);

    let removedLinks: Map<number, RemovedLinkInfo> = new Map<number, RemovedLinkInfo>();
    let portsColors: Map<number, string> = new Map<number, string>();

    for (const portId in props.node.ports) {
      let key: number = parseInt(portId.substring(portId.lastIndexOf('portOutput') + 'portOutput'.length));

      if (props.node.ports[portId].properties.linkColor) {
        portsColors.set(key, props.node.ports[portId].properties.linkColor);
      } else {
        portsColors.set(key, PORT_DEFAULT_COLOR);
      }
    }

    for (const linkId in chartStore.chart.links) {
      if (chartStore.chart.links[linkId].from.nodeId === props.node.id) {

        let key: number = parseInt(chartStore.chart.links[linkId].from.portId.substring(chartStore.chart.links[linkId].from.portId.lastIndexOf('portOutput') + 'portOutput'.length));

        removedLinks.set(key, {
          toNodeId: chartStore.chart.links[linkId].to.nodeId,
          toPortId: chartStore.chart.links[linkId].to.portId
        });

        chartStore.removeLink(linkId);
      }

    }

    chartStore.chart.nodes[props.node.id].properties["customizablePortsCount"] = value as unknown as number;
    chartStore.chart.nodes[props.node.id].ports = {
      [PORT_ID_INPUT]: chartStore.chart.nodes[props.node.id].ports[PORT_ID_INPUT]
    };

    for (let i = 1; i <= chartStore.chart.nodes[props.node.id].properties["customizablePortsCount"]; i++) {
      let align: string = "center";

      if (chartStore.chart.nodes[props.node.id].properties["customizablePortsCount"] > 1 && i === 1) {
        align = "left";
      } else if (chartStore.chart.nodes[props.node.id].properties["customizablePortsCount"] > 1
        && i === parseInt(chartStore.chart.nodes[props.node.id].properties["customizablePortsCount"])) {

        align = "right";
      }

      const newPortId: string = "portOutput" + i + "_" + v4();

      chartStore.chart.nodes[props.node.id].ports[newPortId] = {
        id: newPortId,
          type: "output",
          properties: {
            align: align,
            treeRearrangerPosition: i,
            restrictOutcomingManualLinks: true,
            linkColor: portsColors.get(i),
        }
      }

      if (removedLinks.has(i)) {
        const newLinkId: string = v4();
        chartStore.chart.links[newLinkId] = {
          id: newLinkId,
          from: {
            nodeId: props.node.id,
            portId: newPortId,
          },
          to: {
            nodeId: removedLinks.get(i)?.toNodeId,
            portId: removedLinks.get(i)?.toPortId,
          }
        } as ILink;
      }

      const treeRootNodeId: string = PortDropUtils.findTreeRootNode(chartStore.chart, props.node.id);
      const treeRearranger = new TreeRearranger(chartStore.chart, treeRootNodeId, props.node.id);
      chartStore.setChart(treeRearranger.calculateRearrangedTree());
    }
  };

  return (
    <EuiSuperSelect
      options={options}
      valueOfSelected={value}
      onChange={onChange}
      itemLayoutAlign="top"
      hasDividers
    />
  );
}

export default SuperSelectComplex;
