import axios, { type AxiosInstance, type AxiosRequestConfig } from 'axios'

export interface RequestConfig extends AxiosRequestConfig {
  baseURL: string
}

export class RequestFactory {
  private config: RequestConfig

  constructor(config: RequestConfig) {
    this.config = config
  }

  create(): AxiosInstance {
    const instance = axios.create({
      ...this.config,
      timeout: this.config.timeout ?? 10000,
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers
      }
    })

    instance.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('token')
        if (token) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    instance.interceptors.response.use(
      (response) => {
        return response.data
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    return instance
  }
}

const httpFactory = new RequestFactory({
  baseURL: import.meta.env.VITE_API_BASE_URL+'/student' || '/'
})

const authFactory = new RequestFactory({
  baseURL: import.meta.env.VITE_API_BASE_URL+'/security' || '/'
})



export const http: AxiosInstance = httpFactory.create()
export const auth: AxiosInstance = authFactory.create()
