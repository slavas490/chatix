/*
 * constants
 */

export const LOGIN = 0
export const LOGOUT = 1


/*
 * functions
 */

export function login () {
    return { type: LOGIN }
}

export function logout () {
    return { type: LOGOUT }
}