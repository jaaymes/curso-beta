import { GetServerSidePropsContext } from 'next'

import { CookieParseOptions, CookieSerializeOptions } from 'cookie'
import { destroyCookie, parseCookies, setCookie } from 'nookies'

export const getCookie = (
  key: string,
  defaultValue: any = null,
  ctx?: any,
  options?: CookieParseOptions
) => {
  const cookies = parseCookies(ctx, options)

  const data = cookies[key] ? JSON.parse(cookies[key]) : defaultValue

  return data
}

export const removeCookie = (
  key: string,
  context: GetServerSidePropsContext,
  options?: CookieSerializeOptions
) => {
  destroyCookie(context, key, options)
}

export function eraseAllCookies() {
  document.cookie.split(';').forEach(c => {
    document.cookie = c
      .replace(/^ +/, '')
      .replace(/=.*/, '=;expires=' + new Date().toUTCString() + ';path=/')
  })

  const cookies = document.cookie.split(';')

  for (let i = 0; i < cookies.length; i++) {
    const cookie = cookies[i]
    const eqPos = cookie.indexOf('=')
    const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
    document.cookie = name + '=;expires=Thu, 01 Jan 1970 00:00:00 GMT'
  }
}
export const createCookie = async (
  key: string,
  data: unknown,
  context?: GetServerSidePropsContext,
  options?: CookieSerializeOptions
) => {
  const stringfiedData = JSON.stringify(data)

  setCookie(context, key, stringfiedData, options)
}

export const getToken = (context?: GetServerSidePropsContext) => {
  const token = getCookie('token', null, context)
  return token
}
