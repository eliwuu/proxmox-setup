import fs from 'fs/promises'
import db from './database/db.connection'

const dbExists = async () => await fs.stat('db.sqlite')

const getMainNode = async () =>
  await db.selectFrom('main_node').where('id', '=', 0).executeTakeFirst()

const seedMainNode = async () => {
  await db
    .insertInto('main_node')
    .values({ id: 0, name: process.env.MAIN_NODE_NAME! })
    .execute()
}

export const firstRun = async () => {
  const mainNodeSet = process.env.MAIN_NODE_NAME

  if (!mainNodeSet) {
    console.error('Main node not set, add MAIN_NODE_NAME in .env file')
    process.exit(1)
  }

  const dbExist = await dbExists()

  if (!dbExist) {
    console.error('Db not initialised, missing db.sqlite')
    process.exit(1)
  }

  const mainNodeSeeded = await getMainNode()

  if (!mainNodeSeeded) {
    return { isInitialised: false }
  }

  return { isInitialised: true }
}

export const onStart = async () => {
  const { isInitialised } = await firstRun()

  if (!isInitialised) {
    console.log(`Seeding main_node table with ${process.env.MAIN_NODE_NAME}`)
    await seedMainNode()
  }
}
