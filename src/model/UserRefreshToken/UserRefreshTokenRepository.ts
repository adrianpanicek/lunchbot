import {Repository} from "../Repository";
import {UserRefreshToken} from "./UserRefreshToken";

export class UserRefreshTokenRepository extends Repository<UserRefreshToken> {
    protected getHashKey(): keyof UserRefreshToken {
        return 'token';
    }

    protected getModelType(): { new(): UserRefreshToken } {
        return UserRefreshToken;
    }

    protected getThroughput(): { readCapacityUnits: number, writeCapacityUnits: number } {
        return {readCapacityUnits: 2, writeCapacityUnits: 2};
    }
}