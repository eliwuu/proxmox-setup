import { BaseManager } from './baseManager'
import { authorizedUser } from './proxmox.auth'
import type { NodeData, Nodes, Vms } from './types'

export class NodeManager extends BaseManager {
  private readonly nodesEndpoint: string
  constructor() {
    super()
    this.nodesEndpoint = this.getEndpoint('nodes')
  }

  getNodes = async () => {
    const result = await authorizedUser.Get<Nodes>(this.nodesEndpoint)

    return result
  }
  getNodesIdName = (nodes: Nodes) => nodes.data.map((x) => ({ id: x.id, name: x.node }))

  getNode = async (nodeName: string) => this.get<NodeData>(nodeName)

  getVmsForNode = async (nodeName: string) => this.get<Vms>(nodeName, 'qemu')

  private get = async <T>(nodeName?: string, postfix?: string) => {
    if (!nodeName) {
      return await authorizedUser.Get<T>(this.nodesEndpoint)
    }
    const nodeEndpoint = this.combineEndpoint(this.nodesEndpoint, postfix ? `${nodeName}/${postfix}` : `${nodeName}`)

    const result = await authorizedUser.Get<T>(nodeEndpoint)

    return result
  }
}
