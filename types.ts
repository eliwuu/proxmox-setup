export interface Nodes {
  data: NodeData[]
}

export interface NodeData {
  ssl_fingerprint: string
  maxcpu: number
  level: string
  node: string
  uptime: number
  disk: number
  maxdisk: number
  cpu: number
  maxmem: number
  id: string
  status: string
  type: string
  mem: number
}

export interface Vms {
  data: VmData[]
}

export interface VmData {
  disk: number
  netout: number
  maxdisk: number
  netin: number
  maxmem: number
  cpu: number
  mem: number
  status: string
  pid: number
  diskwrite: number
  vmid: number
  cpus: number
  diskread: number
  uptime: number
  name: string
}
