import {IChart, IConfig, IOnDeleteKey, IStateCallback} from "@artemantcev/react-flow-chart";
import {NODE_ID_ROOT} from "../../../store/ChartStore";

export const ACTION_ON_DELETE_KEY = "onDeleteKey";

export const onDeleteKeyAction: IStateCallback<IOnDeleteKey> = ({ config }: IConfig) => (chart: IChart) => {
  if (config.readonly) {
    return chart
  }
  if (chart.selected.type === 'node' && chart.selected.id) {
    const node = chart.nodes[chart.selected.id]

    // NODE_ID_ROOT (Enter Workflow) should always be on the canvas
    if (node.readonly || node.id === NODE_ID_ROOT) {
      return chart
    }

    // Delete the connected links
    Object.keys(chart.links).forEach((linkId) => {
      const link = chart.links[linkId]
      if (link.from.nodeId === node.id || link.to.nodeId === node.id) {
        delete chart.links[link.id]
      }
    })

    // Delete the node
    delete chart.nodes[chart.selected.id]

  } else if (chart.selected.type === 'link' && chart.selected.id) {
    delete chart.links[chart.selected.id]
  }

  if (chart.selected) {
    chart.selected = {}
  }

  return chart
}
