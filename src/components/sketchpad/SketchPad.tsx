import React, {useEffect, useMemo, useState} from "react";
import { Observer } from "mobx-react-lite";
import {
  EuiButton,
  EuiButtonEmpty, EuiButtonToggle, EuiFlexGroup,
  EuiHeader,
  EuiHeaderBreadcrumbs,
  EuiHeaderSection,
  EuiHeaderSectionItem,
} from "@elastic/eui";
import '../../assets/css/sketchpad.css';
import {CHART_DEFAULT, MAX_ZOOM_VALUE, NODE_ID_ROOT, useChartStore} from "../../store/ChartStore";
import { NodeInner } from "./layout/NodeInner";
import NodeMenu from "./NodeMenu";
import { CanvasOuter } from "./layout/CanvasOuter";
import { EuiFlexItem } from "@elastic/eui";
import PortCustom from "./layout/PortCustom";
import {
  actions,
  FlowChart,
  IChart,
  IFlowChartCallbacks,
  ILink,
  IOnDragNodeStopInput, IOnLinkCancel,
  IOnLinkCompleteInput,
} from "@artemantcev/react-flow-chart";
import v4 from "uuid/v4";
import { IOnLinkBaseEvent } from "@artemantcev/react-flow-chart/src/types/functions";
import axios, { AxiosResponse } from "axios";
import { Redirect } from "react-router-dom";
import Flyout from "./flyout/Flyout";
import TreeRearranger from "./service/TreeRearranger";
import CanvasInner from "./layout/CanvasInner";
import PortDropUtils from "./service/PortDropUtils";
import {ACTION_ON_DELETE_KEY, onDeleteKeyAction} from "./service/ChartActions";

function SketchPad(props: any) {
  const chartStore = useChartStore();
  const [portsAreHidden, setPortsAreHidden] = useState(true);
  const [isEditMode, setIsEditMode] = useState(props.match.params.chartId ? false : true);
  const [isRearrangeRequested, setIsRearrangeRequested] = useState(false);
  const [redirectToId, setRedirectToId] = useState("");

  useEffect(() => {
    if (props.match.params.chartId) {
      axios.get('http://localhost:4000/journey/' + props.match.params.chartId)
        .then((response: AxiosResponse<IChart>) => {
          console.log("chart-response->", response);
          chartStore.setChart(response.data as IChart);
        })
        .catch((error) => console.log("chart->", error))
        .finally(() => {
          // always executed
        });
    }
  }, []);

  const updateChart = () => {
    if (props.match.params.chartId) {
      axios.put('http://localhost:4000/journey/' + props.match.params.chartId, chartStore.chart)
        .then((response: AxiosResponse<IChart>) => {
          console.log("chart-update-response->", response);
        })
        .catch((error) => console.log("chart-update->", error));
    } else {
      axios.post('http://localhost:4000/journey', chartStore.chart)
        .then((response: AxiosResponse<any>) => {
          console.log("chart-save-response->", response.data);
          setRedirectToId(response.data);
        })
        .catch((error) => console.log("chart-save->", error.toString()));
    }
  }

  const customCallbacks = useMemo<{ [key: string]: any }>(() => {
    return {
      onLinkStart: (input: IOnLinkBaseEvent) => {
        setPortsAreHidden(false);
      },
      onLinkComplete: (input: IOnLinkCompleteInput) => {
        chartStore.removeLink(input.linkId);
        const invertedLinkId = v4();

        if (input.toPortId === input.fromPortId || input.toNodeId === input.fromNodeId) {
          setPortsAreHidden(true);
          return;
        }

        // avoid multiple links of any type for any port
        for (let linkId in chartStore.chart.links) {
          let linkObject: ILink = chartStore.chart.links[linkId];
          if (
            (linkObject.from.portId === input.fromPortId && linkObject.from.nodeId === input.fromNodeId)
            || (linkObject.to.portId === input.toPortId && linkObject.to.nodeId === input.toNodeId)
            || (linkObject.to.portId === input.fromPortId && linkObject.to.nodeId === input.fromNodeId)
            || (linkObject.from.portId === input.toPortId && linkObject.from.nodeId === input.toNodeId)
          ) {
            setPortsAreHidden(true);
            return;
          }
        }

        chartStore.addLink({
          id: invertedLinkId,
          from: {
            nodeId: input.toNodeId,
            portId: input.toPortId,
          },
          to: {
            nodeId: input.fromNodeId,
            portId: input.fromPortId,
          }
        }, invertedLinkId);

        const treeRootNodeId: string = PortDropUtils.findTreeRootNode(chartStore.chart, input.toNodeId);
        const treeRearranger = new TreeRearranger(chartStore.chart, treeRootNodeId, input.toNodeId);
        chartStore.setChart(treeRearranger.calculateRearrangedTree());
        setPortsAreHidden(true);
      },
      onLinkCancel: (input: IOnLinkCancel) => {
        setPortsAreHidden(true);
      },
      onDragNode: (input: IOnDragNodeStopInput) => {
        const searchForChildrenNodes = (parentNodeId: string): string[] => {
          let childNodesIds: string[] = [];

          for (let linkId in currentLinks) {
            let linkObject: ILink = currentLinks[linkId];

            if (linkObject.to.nodeId && linkObject.from.nodeId === parentNodeId) {
              childNodesIds.push(linkObject.to.nodeId);
              childNodesIds = childNodesIds.concat(searchForChildrenNodes(linkObject.to.nodeId));
            }
          }

          return childNodesIds;
        };

        const moveChildrenBlocks = (childNodesIds: string[], currentNodes: any, currentLinks: any) => {
          childNodesIds.forEach((childNodeId: string) => {
            if (currentNodes[childNodeId]) {
              currentNodes[childNodeId].position = {
                x: currentNodes[childNodeId].position.x + input.data.deltaX,
                y: currentNodes[childNodeId].position.y + input.data.deltaY
              }
            }
          });

          chartStore.chart.nodes = currentNodes;
          chartStore.chart.links = currentLinks;
        };

        let currentNodes = Object.assign({}, chartStore.chart.nodes);
        let currentLinks = Object.assign({}, chartStore.chart.links);

        let childrenNodesIds: string[] = searchForChildrenNodes(input.id);
        moveChildrenBlocks(childrenNodesIds, currentNodes, currentLinks);
      },
    }
  }, []);

  const stateActionCallbacks = useMemo(() => {
    return Object.entries(actions).reduce(
      (
        acc: { [key: string]: any },
        [actionKey, action]: [string, (...args: any) => any]
      ) => {
        acc[actionKey] = (...args: any) => {
          let newChartTransformer;

          if (actionKey === ACTION_ON_DELETE_KEY) {
            // @ts-ignore
            newChartTransformer = onDeleteKeyAction(...args);
          } else {
            newChartTransformer = action(...args);
          }

          const newChart = newChartTransformer(chartStore.chart);

          if (customCallbacks[actionKey]) {
            customCallbacks[actionKey](...args);
          }

          chartStore.setChart({ ...newChart });

          return newChart;
        }

        return acc;
      },
      {}
    ) as IFlowChartCallbacks
  }, [chartStore.chart, customCallbacks]);

  if (isRearrangeRequested) {
    const treeRearranger = new TreeRearranger(chartStore.chart, NODE_ID_ROOT, undefined);
    chartStore.setChart(treeRearranger.calculateRearrangedTree());
    setIsRearrangeRequested(false);
  }

  return (
    <Observer>{() =>
      <>
        { redirectToId && redirectToId.length > 0 ? <Redirect to={"/sketchpad/" + redirectToId} /> : "" }
        <EuiHeader>
          <EuiHeaderSection grow={false}>
            <EuiHeaderSectionItem border="none">
              <EuiButtonEmpty
                iconType="arrowLeft"
                href={"/"}
              >
                Back
              </EuiButtonEmpty>
            </EuiHeaderSectionItem>
          </EuiHeaderSection>
          <EuiHeaderBreadcrumbs breadcrumbs={[]}/>
          <EuiHeaderSection side="right" className="content-center">
            <EuiButton
              fill
              onClick={() => {setIsRearrangeRequested(true)}}
              size="s"
              color="text"
            >
              Re-arrange
            </EuiButton>
            <EuiButtonToggle
              label={"Edit"}
              fill={isEditMode}
              onChange={() => { setIsEditMode(!isEditMode) }}
              isSelected={true}
              style={{ marginLeft: 10 }}
              size="s"
            />
            <EuiButton
              fill
              onClick={updateChart}
              size="s"
              color="secondary"
              style={{ marginLeft: 10 }}
            >
              Save
            </EuiButton>
            <EuiButton
              fill
              onClick={() => { chartStore.setChart(CHART_DEFAULT); }}
              size="s"
              color="danger"
              style={{ marginLeft: 10, marginRight: 10 }}
            >
              Clear
            </EuiButton>
          </EuiHeaderSection>
        </EuiHeader>
        <EuiFlexGroup
          gutterSize="none"
          onDragOver={(event) => {
            setPortsAreHidden(false);
          }}
          onDragEnd={(event) => {
            setPortsAreHidden(true);
          }}
        >
          <EuiFlexItem grow={false}>
            <NodeMenu />
          </EuiFlexItem>
          <EuiFlexItem>
            <FlowChart
              chart={chartStore.chart}
              callbacks={stateActionCallbacks}
              config={{
                readonly: !isEditMode,
                smartRouting: false,
                isFreeDraggingRestricted: true,
                portsAreHidden: portsAreHidden,
                zoom: {
                  maxScale: MAX_ZOOM_VALUE,
                },
              }}
              Components={{
                NodeInner: NodeInner,
                CanvasOuter: CanvasOuter,
                CanvasInner: CanvasInner,
                Port: PortCustom,
              }}
            />
          </EuiFlexItem>
          {chartStore.chart.selected.type === "node"
              && chartStore.chart.selected.id
              && chartStore.chart.nodes[chartStore.chart.selected.id]
              && chartStore.chart.nodes[chartStore.chart.selected.id].type === "Filter Group"
            ? <Flyout node={chartStore.chart.nodes[chartStore.chart.selected.id]} isVisible={true} />
            : ''}
        </EuiFlexGroup>
      </>
    }</Observer>
  );
}

export default SketchPad;
