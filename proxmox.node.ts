import { BaseManager } from './baseManager'
import { host } from './config'
import { authorized, authorizedUser } from './proxmox.auth'
import type { NodeData, Nodes, Vms } from './types'

export class NodeManager extends BaseManager {
  private readonly nodesEndpoint: string
  constructor(private readonly mode: 'user' | 'apiKey') {
    super()
    this.nodesEndpoint = this.getEndpoint('nodes')
  }

  getNodes = async () => {
    const result =
      this.mode === 'apiKey'
        ? await authorized.Get<Nodes>(this.nodesEndpoint)
        : await authorizedUser.Get<Nodes>(this.nodesEndpoint)

    return result
  }
  getNodesIdName = (nodes: Nodes) => nodes.data.map((x) => ({ id: x.id, name: x.node }))

  getNode = async (nodeName: string) => {
    const nodeEndpoint = this.combineEndpoint(this.nodesEndpoint, `${nodeName}`)
    const result =
      this.mode === 'apiKey'
        ? await authorized.Get<NodeData>(nodeEndpoint)
        : await authorizedUser.Get<NodeData>(nodeEndpoint)

    return result
  }

  getVmsForNode = async (nodeName: string) => {
    const nodeEndpoint = this.combineEndpoint(this.nodesEndpoint, `${nodeName}/qemu`)
    const result =
      this.mode === 'apiKey' ? await authorized.Get<Vms>(nodeEndpoint) : await authorizedUser.Get<Vms>(nodeEndpoint)

    return result
  }
}
