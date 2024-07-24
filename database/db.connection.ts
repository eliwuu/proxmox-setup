import * as path from 'path'
import fs from 'fs/promises'
import { Database } from 'bun:sqlite'
import { FileMigrationProvider, Kysely, Migrator } from 'kysely'
import { BunSqliteDialect } from 'kysely-bun-sqlite'
import type { NodeData, VmData } from '../types'

type NodeTable = NodeData & { node_id: string }
type VmTable = VmData & { id: string; nodeId: string }
type MainNode = { name: string; id: number }

export type DBTables = {
  node: NodeTable
  vm: VmTable
  main_node: MainNode
}

const db = new Kysely<DBTables>({
  dialect: new BunSqliteDialect({
    database: new Database('db.sqlite'),
  }),
})

const migrateToLatest = async () => {
  const migrator = new Migrator({
    db,
    provider: new FileMigrationProvider({
      fs,
      path,
      migrationFolder: path.join(__dirname, 'migrations'),
    }),
  })

  const { error, results } = await migrator.migrateToLatest()

  results?.forEach((it) => {
    if (it.status === 'Success') {
      console.log(`migration _${it.migrationName}_ was executed successfully`)
    }
    if (it.status === 'Error') {
      console.error(`failed to execute migration _${it.migrationName}`)
    }
    if (it.status === 'NotExecuted') {
      console.log(`migration _${it.migrationName} did not executed`)
    }
  })

  if (error) {
    console.log('failed to migrate')
    console.log(error)
    process.exit(1)
  }
}

await migrateToLatest()

export default db
