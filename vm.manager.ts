import { BaseManager } from './baseManager'

import { authorizedUser } from './proxmox.auth'
import type { VmData, Vms } from './types'

export class VmManager extends BaseManager {
  private readonly nodeName: string
  private readonly nodeEndpoint: string
  constructor(nodeName: string) {
    super()
    this.nodeName = nodeName
    this.nodeEndpoint = this.getEndpoint(`nodes/${nodeName}`)
  }
  createVm = async (name: string, opts?: { tag?: string }) => {}
  listVm = async (vmid: number) => {
    const result = await authorizedUser.Get<string>(
      this.combineEndpoint(this.nodeEndpoint, `qemu/${vmid}/status/current`),
    )

    return result
  }
  getVmDetails = async (vmid: number) => {
    const result = await authorizedUser.Get<object>(this.combineEndpoint(this.nodeEndpoint, `qemu/${vmid}/config`))

    return result
  }
  getHostname = async (vmid: number) => {
    const result = await authorizedUser.Get<object>(
      this.combineEndpoint(this.nodeEndpoint, `qemu/${vmid}/agent/get-host-name`),
    )

    return result
  }

  private readonly getAgents = async (vmid: number, agent: string) => {
    const result = await authorizedUser.Get<object>(
      this.combineEndpoint(this.nodeEndpoint, `qemu/${vmid}/agent/${agent}`),
    )

    return result
  }

  getOsInfo = async (vmid: number) => {
    return await this.getAgents(vmid, 'get-osinfo')
  }

  getInfo = async (vmid: number) => {
    return await this.getAgents(vmid, 'info')
  }

  getNetworkInterfaces = async (vmid: number) => {
    return await this.getAgents(vmid, 'network-get-interfaces')
  }

  clone = async (templateVmid: number, nextVmid: number, name: string) => {
    const cloneEndpoint = this.combineEndpoint(this.nodeEndpoint, `qemu/${templateVmid}/clone`)
    const result = await authorizedUser.Post<object>(cloneEndpoint, {
      newid: nextVmid,
      name,
    })

    return { result, vmid: nextVmid }
  }
  getVmsId = (vms: Vms) => vms.data.map((x) => ({ vmid: x.vmid, name: x.name }))

  getNextVmidFromVmsData = (vmData: Vms) => {
    const vmsId = this.getVmsId(vmData)

    const nextVmid = this.getNextVmId(vmsId)

    return nextVmid
  }

  getNextVmId = (vmsId: { vmid: number; name: string }[]) => {
    const ids = vmsId.map((x) => x.vmid)

    const sortedIds = ids.toSorted((a, b) => a - b)

    const largestId = sortedIds[sortedIds.length - 1]

    return largestId + 1
  }

  startVm = async (vmid: number) => {
    const startEndpoint = this.combineEndpoint(this.nodeEndpoint, `qemu/${vmid}/status/start`)

    const result = await authorizedUser.Post<object>(startEndpoint, {})

    return result
  }

  stopVm = async (vmid: number) => {
    const stopEndpoint = this.combineEndpoint(this.nodeEndpoint, `qemu/${vmid}/status/stop`)

    const result = await authorizedUser.Post<object>(stopEndpoint, {})

    return result
  }
}
