import {Factory} from "@app/model/Factory";
import {AccessToken} from "@app/model/User/AccessToken";
import {User} from "@app/model/User/User";

export class UserAccessTokenFactory implements Factory<AccessToken> {
    createFromObject(data: Partial<AccessToken>): AccessToken {
        return Object.assign(new AccessToken, data);
    }

    fromUser(user: User): AccessToken {
        const accessToken = new AccessToken();
        accessToken.user = user.id;

        return accessToken;
    }
}