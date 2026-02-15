import {auth} from '@/utils/request'

export interface LoginParams {
  userType: string
  identifier: string
  password: string
  captcha: string
  captchaKey: string
}

export interface LoginResult {
  code: number
  data: string
  message: string
}

export interface CaptchaData {
  key: string
  data: string
}

export interface CaptchaResult {
  code: number
  data: CaptchaData
  message: string
}

export function login(params: LoginParams): Promise<LoginResult> {
  return auth.post('auth/login', params)
}

export function getCaptcha(): Promise<CaptchaResult> {
  return auth.get('auth/captcha')
}
