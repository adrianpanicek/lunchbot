import {run} from "@app/index";
import {Denied, Failed, responseCreated} from "@app/application";
import {getRepository} from "@app/model/Repository";
import {UserRepository} from "@app/model/User/UserRepository";
import {AccessToken} from "@app/model/User/AccessToken";

const action = async ({body: {accessToken, refreshToken}}) => {
    const token = AccessToken.fromString(accessToken, {ignoreExpiration: true});
    const userRepository = await getRepository<UserRepository>(UserRepository);
    const user = await userRepository.findById(token.user);

    if (!user.refreshTokens.has(refreshToken)) {
        throw new Denied('Invalid refresh token');
    }

    user.refreshTokens.delete(refreshToken);
    const newRefreshToken = user.createRefreshToken();
    user.refreshTokens.add(newRefreshToken);

    await userRepository.update(user);
    return responseCreated({
        accessToken: await token.sign(),
        refreshToken: newRefreshToken
    });
};

export const handle = run(action);