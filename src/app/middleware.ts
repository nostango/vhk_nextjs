import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import acceptLanguage from 'accept-language'
import { fallbackLng, languages } from './i18n/settings'

acceptLanguage.languages(languages)

export const config = {
matcher: '/:lng*'
}

export function middleware(req: NextRequest) {
let lng
if (req.cookies.has('i18next')) {
    lng = acceptLanguage.get(req.cookies.get('i18next')?.value)
}
if (!lng) {
    lng = acceptLanguage.get(req.headers.get('Accept-Language'))
}
if (!lng) {
    lng = fallbackLng
}

if (req.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL(`/${lng}`, req.url))
}

if (req.headers.has('referer')) {
    const refererUrl = new URL(req.headers.get('referer')!)
    const lngInReferer = languages.find((l) => refererUrl.pathname.startsWith(`/${l}`))
    const response = NextResponse.next()
    if (lngInReferer) response.cookies.set('i18next', lngInReferer)
    return response
}

return NextResponse.next()
}