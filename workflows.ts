import { $ } from 'bun'

export class Workflows {
  cloneTestExecutionTemplate = async () => {}
}

const supportedExecutorSystems = ['ubuntu-22.04'] as const
const supportedRunnerSystems = ['ubuntu-22.04', 'ubuntu-23.10', 'ubuntu-24.04'] as const
type SupportedExecutorSystem = (typeof supportedExecutorSystems)[number]
type SupportedRunnerSystem = (typeof supportedRunnerSystems)[number]

type ExecutorConfig = {
  homePath: string //this should be path of /home/usr/
  executionBaseDir: string // testExecutor
  systemName: SupportedExecutorSystem
}

type RunnerConfig = {
  systemName: SupportedRunnerSystem
}

export class ExecutorContext {
  constructor(private readonly executorConfig: {}) {}
}

export class TestExecutorContext {
  constructor(private readonly executorVmid: number) {}
  triggerFetch = async () => {}
  executeTests = async () => {}
  getTestReport = async () => {}
  getAllReports = async () => {}
  getTestReportById = async () => {}
  printTestResults = async () => {}
  saveTestResults = async () => {}
}
