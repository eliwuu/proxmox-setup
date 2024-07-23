import { BaseManager } from './baseManager'
import { authorizedUser } from './proxmox.auth'

type StorageType =
  | 'btrfs'
  | 'cephfs'
  | 'cifs'
  | 'dir'
  | 'esxi'
  | 'glusterfs'
  | 'iscsi'
  | 'iscsidirect'
  | 'lvm'
  | 'lvmthin'
  | 'nfs'
  | 'pbs'
  | 'rbd'
  | 'zfs'
  | 'zfspool'

type PoolType = 'qemu' | 'lxc' | 'storage'

type ContentType = 'rootdir' | 'images'
type Sparse = boolean

type PoolsPutOptional = Partial<{
  allowMove: boolean
  comment: string
  delete: boolean
  storage: string | string[] // storageId to add or remove
  vms: string | string[] // vmId to add or remove
}>

class PoolHandler extends BaseManager {
  constructor(private readonly poolEndpoint: string) {
    super()
  }

  getPools = async (poolId?: string, poolType?: PoolType) => {}
  addPool = async (poolId: string, comment?: string) => {}

  updatePool = async (poolId: string, options?: PoolsPutOptional) => {}

  getPool = async (poolId: string, options?: {}) => {}
  setPool = async (poolId: string, options?: {}) => {}
  deletePool = async (poolId: string, options?: {}) => {}
}

class StorageHandler {}

export class StorageManager extends BaseManager {
  private readonly storageEndpoint: string
  private readonly poolEndpoint: string

  constructor() {
    super()

    this.storageEndpoint = this.getEndpoint(`storage`)
    this.poolEndpoint = this.getEndpoint('pools')
  }

  getPools = async () => {
    const result = await authorizedUser.Get<object>(this.poolEndpoint)

    if (!result) {
      console.warn('No pools found')
    }

    return result
  }

  getStorage = async () => {
    const result = await authorizedUser.Get<object>(this.storageEndpoint)

    if (!result) {
      console.warn('No storage found')
    }

    return result
  }

  addStorage = async (storageType: StorageType) => {}
}
