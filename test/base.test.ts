import { describe, test, expect } from 'bun:test'
import { NodeManager } from '../proxmox.node'
import { authorizedUser } from '../proxmox.auth'
import type { NodeData } from '../types'
import { VmManager } from '../vm.manager'

const Cache = {
  nodes: [] as NodeData[],
  namedNodes: [] as { id: string; name: string }[],
  nodeManager: null as NodeManager | null,
  mainNode: null as { id: string; name: string } | null,
  vmManager: null as VmManager | null,
}
describe('base tests', async () => {
  test('ensure env', () => {
    expect(process.env.USR).not.toBe(null)
    expect(process.env.PASSWORD).not.toBe(null)
    expect(process.env.NODE_TLS_REJECT_UNAUTHORIZED).toBe('0')
  })
  test('initialise node manager', async () => {
    const nodeManager = new NodeManager()

    const actual = await nodeManager.getNodes()

    expect(actual).not.toBe(null)
    expect(actual?.data.length).not.toBe(0)

    Cache.nodeManager = nodeManager
    Cache.nodes = actual!.data
    Cache.namedNodes = nodeManager.getNodesIdName(actual!)
  })
  test('main node exist', async () => {
    const mainNode = Cache.namedNodes.find((x) => x.name === process.env.MAIN_NODE_NAME!)

    expect(mainNode!.name).toBe(process.env.MAIN_NODE_NAME!)
    Cache.mainNode = mainNode!
  })

  test('vms list > 0', async () => {
    const vms = await Cache.nodeManager!.getVmsForNode(Cache.mainNode!.name)

    expect(vms?.data.length).toBeGreaterThan(0)
  })
})

describe('vmManager test', async () => {
  test('get vms names', async () => {
    const vmManager = new VmManager(Cache.mainNode!.name)
  })
})
