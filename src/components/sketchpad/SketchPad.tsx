import {actions, FlowChart, FlowChartWithState, IConfig} from "@mrblenny/react-flow-chart";
import React from "react";
import {Observer} from "mobx-react-lite";
import {
  EuiButton,
  EuiButtonEmpty, EuiButtonToggle, EuiFlexGroup, EuiFlexItem,
  EuiHeader,
  EuiHeaderBreadcrumbs,
  EuiHeaderSection,
  EuiHeaderSectionItem,
  EuiPage,
  EuiPageBody, EuiPageContent
} from "@elastic/eui";
import {Arrow, BlockMenu, DraggedBlock, FlowBlock, TempBlock} from "./blocks";
import {Content, Message, Page, PickSidebar, PickSidebarItem} from "./layout";
import {useJourneyStore} from "../../store/JourneyStore";
import styled from "styled-components";
import { cloneDeep, mapValues } from 'lodash'
import {ISelectedOrHovered} from "@mrblenny/react-flow-chart/src/types/chart";
import '../../assets/css/sketchpad.css';
import { FlyoutSidebar } from "./layout/FlyoutSidebar";

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

const chartSimple = {
  offset: {
    x: 0,
    y: 0,
  },
  scale: 1,
  nodes: {
    node1: {
      id: 'node1',
      type: 'Enter Workflow',
      position: {
        x: 300,
        y: 100,
      },
      ports: {
        port1: {
          id: 'port1',
          type: 'output',
          properties: {
            value: 'yes',
          },
        },
      },
    },
  },
  links: {

  },
  selected: {} as ISelectedOrHovered,
  hovered: {} as ISelectedOrHovered,
  block: 1,
};

export default class SketchPad extends React.Component {
  state = cloneDeep(chartSimple);

  render() {
    const chart = this.state
    const stateActions = mapValues(actions, (func: any) =>
      (...args: any) => this.setState(func(...args))) as typeof actions;

    const config = { readonly: false };

    return (
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
          <PickSidebar>
            <PickSidebarItem
              type="Enter Workflow"
              ports={{
                port1: {
                  id: 'port1',
                  type: 'top',
                  properties: {
                    custom: 'property',
                  },
                },
                port2: {
                  id: 'port1',
                  type: 'bottom',
                  properties: {
                    custom: 'property',
                  },
                },
              }}
              properties={{
                custom: 'property',
              }}
            />
            <PickSidebarItem
              type="Event occurred"
              ports={{
                port1: {
                  id: 'port1',
                  type: 'bottom',
                  properties: {
                    custom: 'property',
                  },
                },
              }}
            />
            <PickSidebarItem
              type="Time has passed"
              ports={{
                port1: {
                  id: 'port1',
                  type: 'left',
                  properties: {
                    custom: 'property',
                  },
                },
                port2: {
                  id: 'port2',
                  type: 'right',
                  properties: {
                    custom: 'property',
                  },
                },
              }}
            />
            <PickSidebarItem
              type="Exit Workflow"
              ports={{
                port1: {
                  id: 'port1',
                  type: 'left',

                },
                port2: {
                  id: 'port2',
                  type: 'right',
                },
                port3: {
                  id: 'port3',
                  type: 'top',
                },
                port4: {
                  id: 'port4',
                  type: 'bottom',
                },
              }}
            />
            <PickSidebarItem
              type="Push Action"
              ports={{
                port1: {
                  id: 'port1',
                  type: 'left',

                },
                port2: {
                  id: 'port2',
                  type: 'right',
                },
                port3: {
                  id: 'port3',
                  type: 'top',
                },
                port4: {
                  id: 'port4',
                  type: 'bottom',
                },
                port5: {
                  id: 'port5',
                  type: 'left',
                },
                port6: {
                  id: 'port6',
                  type: 'right',
                },
                port7: {
                  id: 'port7',
                  type: 'top',
                },
                port8: {
                  id: 'port8',
                  type: 'bottom',
                },
                port9: {
                  id: 'port9',
                  type: 'left',
                },
                port10: {
                  id: 'port10',
                  type: 'right',
                },
                port11: {
                  id: 'port11',
                  type: 'top',
                },
                port12: {
                  id: 'port12',
                  type: 'bottom',
                },
              }}
            />
            <PickSidebarItem
              type="SMS Action"
              ports={{
                port1: {
                  id: 'port1',
                  type: 'left',
                  properties: {
                    custom: 'property',
                  },
                },
                port2: {
                  id: 'port2',
                  type: 'right',
                  properties: {
                    custom: 'property',
                  },
                },
              }}
            />
            <PickSidebarItem
              type="E-mail Action"
              ports={{
                port1: {
                  id: 'port1',
                  type: 'left',
                  properties: {
                    custom: 'property',
                  },
                },
                port2: {
                  id: 'port2',
                  type: 'right',
                  properties: {
                    custom: 'property',
                  },
                },
              }}
            />
            <PickSidebarItem
              type="Web Action"
              ports={{
                port1: {
                  id: 'port1',
                  type: 'left',
                  properties: {
                    custom: 'property',
                  },
                },
                port2: {
                  id: 'port2',
                  type: 'right',
                  properties: {
                    custom: 'property',
                  },
                },
              }}
            />
          </PickSidebar>
          <Content>
            <FlowChart chart={chart} callbacks={stateActions}/>
          </Content>
          {chart.selected.type
            ? <FlyoutSidebar>
                <Message>
                  <div>Type: {chart.selected.type}</div>
                  <div>ID: {chart.selected.id}</div>
                  <br/>
                  {/*
                    We can re-use the onDeleteKey action. This will delete whatever is selected.
                    Otherwise, we have access to the state here so we can do whatever we want.
                  */}
                <Button onClick={() => stateActions.onDeleteKey({config})}>Delete</Button>
              </Message>
            </FlyoutSidebar>
          : ''}
        </Page>
      </>);
  }
}