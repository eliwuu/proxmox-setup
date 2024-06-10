import { host } from './config'

export class BaseManager {
  public readonly Endpoint = `https://${host}/api2/json`

  /**
   *
   * @param postfix string
   * @returns string: `https://{host}/api2/json/postfix
   */
  public getEndpoint = (postfix: string) => `${this.Endpoint}/${postfix}`
  public combineEndpoint = (prefix: string, postfix: string) => `${prefix}/${postfix}`
}
