type Iso = {
  id: string
  storageId?: string
  family: 'linux' | 'windows'
  subfamily: 'ubuntu' | 'fedora'
  version: string
  misc?: string
}

interface IIsoStorage {
  loadStorage(): Promise<Iso[]>
  refreshStorage(): Promise<Iso[]>
}

export class IsoManager {
  constructor(private readonly storage: IIsoStorage) {}
}
