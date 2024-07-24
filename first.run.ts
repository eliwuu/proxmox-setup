export const firstRun = async () => {}

export const onStart = async () => {
  // check if first run

  await firstRun()
  // check if node seeded

  const mainNodeFromEnv = process.env.MAIN_NODE
  // ensure connection
}
