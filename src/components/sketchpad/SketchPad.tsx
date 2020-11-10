import {actions, FlowChart, IFlowChartCallbacks} from "@mrblenny/react-flow-chart";
import React, { useCallback, useMemo } from "react";
import { Observer } from "mobx-react-lite";
import {
  EuiButton,
  EuiButtonEmpty, EuiButtonToggle,
  EuiHeader,
  EuiHeaderBreadcrumbs,
  EuiHeaderSection,
  EuiHeaderSectionItem,
} from "@elastic/eui";
import { Content, Message, Page, PickSidebar, PickSidebarItem } from "./layout";
import styled from "styled-components";
import '../../assets/css/sketchpad.css';
import { FlyoutSidebar } from "./layout/FlyoutSidebar";
import { useChartStore } from "../../store/ChartStore";
import {NodeInner} from "./node/NodeInner";
import NodeMenu from "./NodeMenu";

const Button = styled.div`
  padding: 10px 15px;
  background: cornflowerblue;
  color: white;
  border-radius: 3px;
  text-align: center;
  transition: 0.3s ease all;
  cursor: pointer;
  &:hover {
    box-shadow: 0 10px 20px rgba(0,0,0,.1);
  }
  &:active {
    background: #5682d2;
  }
`

function SketchPad() {
  const chartStore = useChartStore();
  const config = { readonly: false };

  const handleNodeClick = (nodeId: string) => {

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
        <Page>
          <NodeMenu />
          <Content>
            <FlowChart
              chart={chartStore.chart}
              callbacks={stateActionCallbacks}
              Components={{
                NodeInner: NodeInnerCustom
              }}
            />
          </Content>
          {chartStore.chart.selected.type
            ? <FlyoutSidebar>
              <Message>
                <div>Type: {chartStore.chart.selected.type}</div>
                <div>ID: {chartStore.chart.selected.id}</div>
                <br/>
                {/*
                    We can re-use the onDeleteKey action. This will delete whatever is selected.
                    Otherwise, we have access to the state here so we can do whatever we want.
                */}
                <Button onClick={() => stateActionCallbacks.onDeleteKey({config})}>Delete</Button>
              </Message>
            </FlyoutSidebar>
            : ''}
        </Page>
      </>
    }</Observer>
  );
}

export default SketchPad;