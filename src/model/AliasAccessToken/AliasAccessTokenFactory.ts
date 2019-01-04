import {Factory} from "../Factory";
import {AliasAccessToken} from "./AliasAccessToken";

export class AliasAccessTokenFactory implements Factory<AliasAccessToken> {
    createFromObject(data: Partial<AliasAccessToken>): AliasAccessToken {
        return Object.assign(new AliasAccessToken, data);
    }
}