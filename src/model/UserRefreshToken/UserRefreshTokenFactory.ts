import {Factory} from "../Factory";
import {UserRefreshToken} from "./UserRefreshToken";

export class UserRefreshTokenFactory implements Factory<UserRefreshToken> {
    createFromObject(data: Partial<UserRefreshToken>): UserRefreshToken {
        return Object.assign(new UserRefreshToken, data);
    }
}