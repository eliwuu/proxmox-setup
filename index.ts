import { NodeManager } from './proxmox.node'
import { VmManager } from './vm.manager'

const nodeManager = new NodeManager('user')

const nodes = await nodeManager.getNodes()

if (!nodes) {
  console.log('No nodes found')
}

// console.log(nodes)

const namedNodes = nodeManager.getNodesIdName(nodes!)

const mainNode = namedNodes.find((x) => x.name === process.env.MAIN_NODE_NAME!)

const node = await nodeManager.getNode(mainNode!.name)

if (!mainNode) {
  console.log(`Main node ${process.env.MAIN_NODE_NAME} not found`)
}
const vms = await nodeManager.getVmsForNode(mainNode!.name)

// console.log(vms)

if (!vms) {
  console.log('No vms')
}

const vmsNameId = vms!.data.map((x) => ({ vmid: x.vmid, name: x.name }))

const vmManager = new VmManager(mainNode?.name!)

const getVmDetails = vmsNameId.map((x) => vmManager.listVm(x.vmid!))

const vmDetails = await vmManager.getVmDetails(100)

// console.log(vmDetails)

const hostInfo = await vmManager.getHostname(100)
console.log(hostInfo)

const vmOsInfo = await vmManager.getOsInfo(100)
const vmInfo = await vmManager.getInfo(100)
const vmNetworkInterfaces = await vmManager.getNetworkInterfaces(100)

console.log('osinfo', vmOsInfo)
console.log('info', vmInfo)
console.log('network ifaces', vmNetworkInterfaces)

const nextVmid = vmManager.getNextVmidFromVmsData(vms!)

// const createClone = await vmManager.clone(101, nextVmid, `ubuntu-clone-${crypto.randomUUID()}`)

// console.log(createClone)

const vmStart = await vmManager.startVm(105)
const vmStop = await vmManager.stopVm(101)
