import type { Kysely } from 'kysely'
import type { DBTables } from '../db.connection'

export const up = async (db: Kysely<DBTables>): Promise<void> => {
  await db.schema
    .createTable('node')
    .ifNotExists()
    .addColumn('node_id', 'text', (col) => col.primaryKey())
    .addColumn('ssl_fingerprint', 'text')
    .addColumn('maxcpu', 'text')
    .addColumn('level', 'text')
    .addColumn('node', 'text')
    .addColumn('uptime', 'text')
    .addColumn('disk', 'text')
    .addColumn('maxdisk', 'text')
    .addColumn('cpu', 'text')
    .addColumn('maxmem', 'text')
    .addColumn('id', 'text')
    .addColumn('status', 'text')
    .addColumn('type', 'text')
    .addColumn('mem', 'text')
    .execute()

  await db.schema
    .createTable('vm')
    .ifNotExists()
    .addColumn('id', 'text', (col) => col.primaryKey())
    .addColumn('nodeId', 'text', (col) =>
      col.references('node.node_id').onDelete('cascade').notNull(),
    )
    .addColumn('disk', 'text')
    .addColumn('netout', 'text')
    .addColumn('maxdisk', 'text')
    .addColumn('netin', 'text')
    .addColumn('maxmem', 'text')
    .addColumn('cpu', 'text')
    .addColumn('mem', 'text')
    .addColumn('status', 'text')
    .addColumn('pid', 'text')
    .addColumn('diskwrite', 'text')
    .addColumn('vmid', 'text')
    .addColumn('cpus', 'text')
    .addColumn('diskread', 'text')
    .addColumn('uptime', 'text')
    .addColumn('name', 'text')
    .execute()

  await db.schema
    .createTable('main_node')
    .ifNotExists()
    .addColumn('id', 'integer', (col) => col.primaryKey())
    .addColumn('name', 'text')
    .execute()
}

export const down = async (db: Kysely<DBTables>): Promise<void> => {
  await db.schema.dropTable('node').ifExists().execute()
  await db.schema.dropTable('vm').ifExists().execute()
  await db.schema.dropTable('main_node').ifExists().execute()
}
