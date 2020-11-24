import React, {useCallback, useEffect, useMemo, useState} from "react";
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
import {CHART_DEFAULT, MAX_ZOOM_VALUE, PORT_ID_INPUT, useChartStore} from "../../store/ChartStore";
import { NodeInner } from "./layout/NodeInner";
import NodeMenu from "./NodeMenu";
import { CanvasOuter } from "./layout/CanvasOuter";
import { EuiFlexItem } from "@elastic/eui";
import PortCustom from "./layout/PortCustom";
import {
  actions,
  FlowChart, IChart,
  IFlowChartCallbacks, ILink, IOnDragNodeStopInput, IOnLinkCompleteInput,
} from "@artemantcev/react-flow-chart";
import v4 from "uuid/v4";
import { IOnLinkBaseEvent } from "@artemantcev/react-flow-chart/src/types/functions";
import axios, { AxiosResponse } from "axios";
import { Redirect } from "react-router-dom";

function SketchPad(props: any) {
  const chartStore = useChartStore();
  const [portsAreHidden, setPortsAreHidden] = useState(true);
  const [isEditMode, setIsEditMode] = useState(props.match.params.chartId ? false : true);
  const [redirectToId, setRedirectToId] = useState("");

  useEffect(() => {
    if (props.match.params.chartId) {
      axios.get('http://localhost:4000/journey/' + props.match.params.chartId)
        .then((response: AxiosResponse<IChart>) => {
          console.log("chart-response->", response);
          chartStore.chart = response.data as IChart;
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

  const handleNodeMouseEnter = (nodeId: string) => {
    // place custom click event here
  };

  const NodeInnerCustom = useCallback(
    (props) => <NodeInner {...props} handleNodeMouseEnter={handleNodeMouseEnter} />,
    [handleNodeMouseEnter]
  );

  const customCallbacks = useMemo<{ [key: string]: any }>(() => {
    return {
      onNodeMouseEnter: ({ nodeId }: { nodeId: string }) => {
        // console.log('Clicked!', nodeId);
        // handleNodeMouseEnter(nodeId);
      },
      onLinkStart: (input: IOnLinkBaseEvent) => {
        setPortsAreHidden(false);
      },
      onLinkComplete: (input: IOnLinkCompleteInput) => {
        chartStore.removeLink(input.linkId);
        const invertedLinkId = v4();

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
  }, [handleNodeMouseEnter]);

  const stateActionCallbacks = useMemo(() => {
    return Object.entries(actions).reduce(
      (
        acc: { [key: string]: any },
        [actionKey, action]: [string, (...args: any) => any]
      ) => {
        acc[actionKey] = (...args: any) => {
          const newChartTransformer = action(...args);
          const newChart = newChartTransformer(chartStore.chart);

          if (customCallbacks[actionKey]) {
            customCallbacks[actionKey](...args);
          }

          chartStore.chart = ({ ...newChart });

          return newChart;
        }

        return acc;
      },
      {}
    ) as IFlowChartCallbacks
  }, [chartStore.chart, customCallbacks]);

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
            <EuiButtonToggle
              label={"Edit"}
              fill={isEditMode}
              onChange={() => { setIsEditMode(!isEditMode) }}
              isSelected={true}
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
              onClick={() => { chartStore.chart = CHART_DEFAULT; }}
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
                smartRouting: true,
                isFreeDraggingRestricted: true,
                portsAreHidden: portsAreHidden,
                zoom: {
                  maxScale: MAX_ZOOM_VALUE,
                },
                validateLink: ({ linkId, fromNodeId, fromPortId, toNodeId, toPortId, chart }): boolean => {
                  // a new link can start only from input port
                  if (fromPortId !== PORT_ID_INPUT) {
                    return false;
                  }

                  // avoid incorrect links between nodes and the ports of the same node
                  const isDifferentPortTypes: boolean = !(fromNodeId === toNodeId
                    || chart.nodes[fromNodeId].ports[fromPortId].type === chart.nodes[toNodeId].ports[toPortId].type);

                  let existingLinksCount: number = 0;
                  let portsHaveNoLinksYet: boolean = true;

                  // avoid multiple links of any type for any port
                  for (let linkId in chartStore.chart.links) {
                    let linkObject: ILink = chartStore.chart.links[linkId];
                    if (
                      (linkObject.from.portId === fromPortId && linkObject.from.nodeId === fromNodeId)
                      || (linkObject.to.portId === toPortId && linkObject.to.nodeId === toNodeId)
                    ) {
                      existingLinksCount++;
                    }
                  }

                  if (existingLinksCount > 1) {
                    portsHaveNoLinksYet = false;
                  }

                  return isDifferentPortTypes && portsHaveNoLinksYet;
                },
              }}
              Components={{
                NodeInner: NodeInnerCustom,
                CanvasOuter: CanvasOuter,
                Port: PortCustom,
              }}
            />
          </EuiFlexItem>
          {chartStore.chart.selected.type
            // IN PROGRESS; TEMPORARILY DISABLED
            // ? <Flyout closeSettings={() => { }} />
            ? ''
            : ''}
        </EuiFlexGroup>
      </>
    }</Observer>
  );
}

export default SketchPad;
