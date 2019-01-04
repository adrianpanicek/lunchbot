import {Repository} from "../Repository";
import {AliasAccessToken} from "./AliasAccessToken";

export class AliasAccessTokenRepository extends Repository<AliasAccessToken> {
    protected getHashKey(): keyof AliasAccessToken {
        return 'alias';
    }

    protected getModelType(): { new(): AliasAccessToken } {
        return AliasAccessToken;
    }

    protected getThroughput(): { readCapacityUnits: number, writeCapacityUnits: number } {
        return {readCapacityUnits: 5, writeCapacityUnits: 5};
    }
}