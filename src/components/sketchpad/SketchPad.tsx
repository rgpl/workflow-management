import {actions, FlowChart, IFlowChartCallbacks} from "@mrblenny/react-flow-chart";
import React, { useCallback, useMemo } from "react";
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
import { FIXED_ZOOM_VALUE, useChartStore } from "../../store/ChartStore";
import { NodeInner } from "./layout/NodeInner";
import NodeMenu from "./NodeMenu";
import Flyout from "./flyout/Flyout";
import { CanvasOuter } from "./layout/CanvasOuter";
import { EuiFlexItem } from "@elastic/eui";

function SketchPad() {
  const chartStore = useChartStore();
  const config = { readonly: false };

  const handleNodeClick = (nodeId: string) => {
    // place custom click event here
  };

  const NodeInnerCustom = useCallback(
    (props) => <NodeInner {...props} handleNodeClick={handleNodeClick} />,
    [handleNodeClick]
  );

  const customCallbacks = useMemo<{ [key: string]: any }>(() => {
    return {
      onNodeClick: ({ nodeId }: { nodeId: string }) => {
        console.log('Clicked!', nodeId);
        handleNodeClick(nodeId);
      },
    }
  }, [handleNodeClick]);

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
        <EuiFlexGroup gutterSize="none">
          <EuiFlexItem grow={false}>
            <NodeMenu />
          </EuiFlexItem>
          <EuiFlexItem>
            <FlowChart
              chart={chartStore.chart}
              callbacks={stateActionCallbacks}
              // set a fixed zoom
              config={{zoom: {
                  minScale: FIXED_ZOOM_VALUE,
                  maxScale: FIXED_ZOOM_VALUE,
              }}}
              Components={{
                NodeInner: NodeInnerCustom,
                CanvasOuter: CanvasOuter,
              }}
            />
          </EuiFlexItem>
          {chartStore.chart.selected.type
            ? <Flyout closeSettings={() => { chartStore.showNodeSettings = false }} />
            : ''}
        </EuiFlexGroup>
      </>
    }</Observer>
  );
}

export default SketchPad;