import { resolve } from 'bun'

class MockIsoStorage implements IIsoStorage {
  async loadStorage(): Promise<Iso[]> {
    const storage = new Promise<Iso[]>((resolve, _reject) => {
      return resolve([
        {
          family: 'server',
          name: 'Ubuntu',
          version: '22.04',
        },
      ])
    })

    return await storage
  }
  refreshStorage(): Promise<Iso[]> {}
}

export class IsoManager {}
