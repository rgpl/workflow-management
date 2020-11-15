import React, {useCallback, useMemo, useState, useEffect} from "react";
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
import {MAX_ZOOM_VALUE, PORT_ID_INPUT, useChartStore} from "../../store/ChartStore";
import { NodeInner } from "./layout/NodeInner";
import NodeMenu from "./NodeMenu";
import { CanvasOuter } from "./layout/CanvasOuter";
import { EuiFlexItem } from "@elastic/eui";
import PortCustom from "./layout/PortCustom";
import {
  actions,
  FlowChart,
  IFlowChartCallbacks, ILink, IOnDragNodeStopInput, IOnLinkCompleteInput,
} from "@artemantcev/react-flow-chart";
import v4 from "uuid/v4";

function SketchPad() {
  const chartStore = useChartStore();
  const [portsAreHidden, setPortsAreHidden] = useState(true);

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
      onLinkStart: () => {
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
        const removeIncomingLink = (currentLinks: any) => {
          for (let linkId in currentLinks) {
            let linkObject: ILink = currentLinks[linkId];

            if (linkObject.from.nodeId && linkObject.to.nodeId === input.id) {
              delete currentLinks[linkId];
            }
          }
        };

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

        removeIncomingLink(currentLinks);
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
        <EuiHeader>
          <EuiHeaderSection grow={false}>
            <EuiHeaderSectionItem border="none">
              <EuiButtonEmpty
                iconType="arrowLeft"
              >
                Back
              </EuiButtonEmpty>
            </EuiHeaderSectionItem>
          </EuiHeaderSection>
          <EuiHeaderBreadcrumbs breadcrumbs={[]}/>
          <EuiHeaderSection side="right" className="content-center">
            <EuiButtonToggle
              label="Edit"
              fill={true}
              onChange={() => { /* editTrigger */
              }}
              isSelected={true}
              size="s"
            />
            <EuiButton
              fill
              onClick={() => { /* exportData */
              }}
              size="s"
              color="secondary"
              style={{marginLeft: 10}}
            >
              Save
            </EuiButton>
            <EuiButton
              fill
              onClick={() => { /* clearSketch */
              }}
              size="s"
              color="danger"
              style={{marginLeft: 10, marginRight: 10}}
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
                readonly: false,
                // smart routing looks nice but it's too heavy in terms of performance
                smartRouting: false,
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
