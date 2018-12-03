export interface BaseUser {
    identificator: string
}

export interface UserToken extends BaseUser {};

export interface AuthUser extends BaseUser {
    password: string,
    salt: string,
    refreshTokens: string[]
}

export interface RefreshToken {
    token: string,
    user_id: string
}

interface AllowedFields {
    [key: string]: boolean;
}

function filterFor<T extends object>(object: object, allowed: AllowedFields): T {
    return Object.keys(object)
        .filter(key => !!allowed[key])
        .reduce((obj, key: string) => {
            obj[key] = object[key];
            return obj;
        }, {}) as T;
}

export const filterForToken = (user: BaseUser) => filterFor<UserToken>(user, {identificator: true});