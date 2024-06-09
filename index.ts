import { NodeManager } from './proxmox.node'

const nodeManager = new NodeManager('user')

const nodes = await nodeManager.getNodes()

if (!nodes) {
  console.log('No nodes found')
}

console.log(nodes)

const namedNodes = nodeManager.getNodesIdName(nodes!)

const mainNode = namedNodes.find((x) => x.name === process.env.MAIN_NODE_NAME!)

const node = await nodeManager.getNode(mainNode!.name)

if (!mainNode) {
  console.log(`Main node ${process.env.MAIN_NODE_NAME} not found`)
}
const vms = await nodeManager.getVmsForNode(mainNode!.name)

console.log(vms)
