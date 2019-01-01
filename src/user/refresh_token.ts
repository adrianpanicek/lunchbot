import {run} from "../index";
import {Denied, Failed, responseCreated} from "../application";
import {getRepository} from "../model/Repository";
import {UserRepository} from "../model/User/UserRepository";
import {UserRefreshTokenRepository} from "../model/UserRefreshToken/UserRefreshTokenRepository";
import {UserRefreshTokenFactory} from "../model/UserRefreshToken/UserRefreshTokenFactory";
import {UserAccessTokenFactory} from "../model/UserAccessToken/UserAccessTokenFactory";
import {UserFactory} from "../model/User/UserFactory";

const action = async ({body: {refreshToken}}) => {
    const tokenRepository = await getRepository<UserRefreshTokenRepository>(UserRefreshTokenRepository);
    const refreshTokenFactory = new UserRefreshTokenFactory();
    const token = refreshTokenFactory.createFromObject({token: refreshToken})

    const savedToken = await tokenRepository.get(token);
    if (!savedToken) {
        console.error('Refresh token not found in database', refreshToken);
        throw new Denied('Refresh token not found');
    }

    const userRepository = await getRepository<UserRepository>(UserRepository);
    const userFactory = new UserFactory();

    let savedUser;
    try {
        savedUser = await userRepository.getConsistent(userFactory.createFromObject({id: savedToken.user}));
    } catch(e) {
        console.error('User with this id not found', savedToken.user);
        throw new Failed('Unknown error');
    }

    const accessTokenFactory = new UserAccessTokenFactory();
    const accessToken = accessTokenFactory.createFromObject(savedUser);
    return responseCreated({
        token: await accessToken.sign()
    });
};

export const handle = run(action);