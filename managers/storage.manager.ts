type StorageType = 'iso' | 'vm' | 'tempalte' | 'disk'

export type StorageData = {
  filename: string
  location: string
  storageType: StorageType
  id: string
}

interface InternalStorage<StorageTypeArray> {
  loadStorage(): Promise<StorageTypeArray>
  refreshStorage(): Promise<StorageTypeArray>
}

export interface IsoStorage<T> extends InternalStorage<StorageData[]> {}
