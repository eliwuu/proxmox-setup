import { host } from './config'

export class ProxmoxAuth {
  private readonly endpoint = `https://${host}/api2/json`
  private readonly authEndpoint = `${this.endpoint}/access/ticket`
  private readonly loginData: URLSearchParams
  private ticket: string = ''
  private CSRFToken: string = ''
  private retryCount = 0
  private maxRetryCount = 5
  private retryTimeout = 1000
  private isAuthorized = false
  constructor(username: string, password: string) {
    this.loginData = new URLSearchParams({
      username: `${username}@pam`,
      password: password,
    })
  }

  authorizeUser = async () => {
    const response = await this.baseAuth()

    const { data } = await response.json()

    if (response.ok) {
      this.ticket = data.ticket
      this.CSRFToken = data.CSRFPreventionToken
      this.isAuthorized = true
      return this
    }

    throw new Error(`Unable to authorize user with \n ${response}`)
  }

  reauthorizeUser = async () => {
    const response = await this.baseReauth()

    const { data } = await response.json()

    if (!response.ok && this.retryCount < this.maxRetryCount) {
      this.isAuthorized = false
      const timeout = setTimeout(async () => {
        this.retryCount += 1
        console.log(`Retrying authorization: ${this.retryCount} of ${this.maxRetryCount}`)
        await this.reauthorizeUser()
      }, this.retryTimeout)
    }
    if (response.ok) {
      return { ticket: data.ticket, CSRFToken: data.CSRFPreventionToken }
    }

    throw new Error(`Unable to reauthorize user with \n ${response}`)
  }

  private baseAuth = async () =>
    await fetch(this.authEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: this.loginData,
    })
  private baseReauth = async () =>
    await fetch(this.authEndpoint, {
      method: 'POST',
      headers: {
        Cookie: `PVEAuthCookie=${this.ticket}`,
        CSRFPreventionToken: this.CSRFToken,
      },
    })

  Post = async <T>(endpoint: string, data: object) => {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Cookie: `PVEAuthCookie=${this.ticket}`,
        CSRFPreventionToken: this.CSRFToken,
      },
      body: new URLSearchParams({ ...data }),
    })

    console.log(result)

    if (!result.ok) {
      console.log(await result.json())
    }

    if (result.ok) {
      const data = await result.json()

      return data as T
    }
    return undefined
  }

  Get = async <T>(endpoint: string) => {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Cookie: `PVEAuthCookie=${this.ticket}`,
        CSRFPreventionToken: this.CSRFToken,
      },
    })
    if (result.ok) {
      const data = (await result.json()) as T

      return data
    }

    return undefined
  }
}

class ProxmoxApiAuth {
  constructor(private readonly tokenId: string, private readonly secret: string) {}

  Post = async <T>(endpoint: string, data: object) => {
    const result = await fetch(endpoint, {
      method: 'POST',
      headers: {
        Authorization: `PVEAPIToken=${this.tokenId}=${this.secret}`,
      },
      body: JSON.stringify(data),
    })

    if (result.ok) {
      return (await result.json()) as T
    }
    return undefined
  }

  Get = async <T>(endpoint: string) => {
    const result = await fetch(endpoint, {
      method: 'GET',
      headers: {
        Authorization: `PVEAPIToken=${this.tokenId}=${this.secret}`,
      },
    })

    if (result.ok) {
      const data = (await result.json()) as T

      return data
    }

    return undefined
  }
}

export const authorized = new ProxmoxApiAuth(process.env.TOKEN_ID!, process.env.TOKEN_SECRET!)

export const authorizedUser = await new ProxmoxAuth(process.env.USR!, process.env.PASSWORD!).authorizeUser()
