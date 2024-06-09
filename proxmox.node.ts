import { host } from './config'
import { authorized, authorizedUser } from './proxmox.auth'
import type { NodeData, Nodes, Vms } from './types'

const nodes = `https://${host}/api2/json/nodes`

export class NodeManager {
  constructor(private readonly mode: 'user' | 'apiKey') {}

  getNodes = async () => {
    const result = this.mode === 'apiKey' ? await authorized.Get<Nodes>(nodes) : await authorizedUser.Get<Nodes>(nodes)

    return result
  }
  getNodesIdName = (nodes: Nodes) => nodes.data.map((x) => ({ id: x.id, name: x.node }))

  getNode = async (nodeName: string) => {
    const result =
      this.mode === 'apiKey'
        ? await authorized.Get<NodeData>(`${nodes}/${nodeName}`)
        : await authorizedUser.Get<NodeData>(`${nodes}/${nodeName}`)

    return result
  }

  getVmsForNode = async (nodeName: string) => {
    const result =
      this.mode === 'apiKey'
        ? await authorized.Get<Vms>(`${nodes}/${nodeName}/qemu`)
        : await authorizedUser.Get<Vms>(`${nodes}/${nodeName}/qemu`)

    return result
  }
}
