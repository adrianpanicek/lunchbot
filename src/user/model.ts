export interface BaseUser {
    email: string
}

export interface AuthUser extends BaseUser {
    password: string,
    salt: string,
    refreshTokens: string[]
}

export interface RefreshToken {
    token: string,
    email: string
}