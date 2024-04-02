import Cookies from 'js-cookie'

export const TOKEN_KEY = 'MY_TOKEN'


/**
 *
 * @param token
 * @param cookieExpires 過期時間
 */
export const setToken = (token: string, cookieExpires: any) => {
    Cookies.set(TOKEN_KEY, token, {expires: cookieExpires || 1})
}

export const getToken = () => {
    const token = Cookies.get(TOKEN_KEY)
    if (token) {
        return token
    } else return false
}

export const delToken = () => {
    Cookies.remove(TOKEN_KEY)
}
