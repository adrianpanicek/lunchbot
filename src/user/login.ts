import {responseSuccess, Denied} from "../application";
import {run} from "../index";
import {getRepository} from "../model/Repository";
import {User} from "../model/User/User";
import {UserRepository} from "../model/User/UserRepository";
import {UserRefreshTokenFactory} from "../model/UserRefreshToken/UserRefreshTokenFactory";
import {UserRefreshTokenRepository} from "../model/UserRefreshToken/UserRefreshTokenRepository";
import {UserAccessTokenFactory} from "../model/UserAccessToken/UserAccessTokenFactory";
import {UserFactory} from "../model/User/UserFactory";
import {UserRefreshToken} from "../model/UserRefreshToken/UserRefreshToken";

export const action = async (req) => {
    const repository = await getRepository<UserRepository>(UserRepository);
    const userFactory = new UserFactory();
    const model = await userFactory.createFromObject(req.body);

    const user = await repository.getByEmail(model);
    if (!user) {
        console.log('User with this email not found', model.email);
        throw new Denied('Wrong credentials');
    }

    model.salt = user.salt; // Check passwords using same salt
    await model.hashPassword();
    if (model.password !== user.password) {
        console.log('User entered invalid password', model.password, user.password);
        throw new Denied('Wrong credentials')
    }

    const refreshToken = await saveRefreshToken(user);

    const accessTokenFactory = new UserAccessTokenFactory();
    const accessToken = accessTokenFactory.createFromObject({user: user.id});

    return responseSuccess({
        refreshToken: refreshToken.token,
        token: await accessToken.sign()
    });
};

const saveRefreshToken = async (user: User): Promise<UserRefreshToken> => {
    console.log('Creating refresh token');
    const refreshToken = new UserRefreshTokenFactory().createFromObject({user: user.id});
    console.log('Created refresh token', refreshToken);

    const refreshTokenRepository = await getRepository<UserRefreshTokenRepository>(UserRefreshTokenRepository);
    const result = await refreshTokenRepository.save(refreshToken);

    console.log('Saved refresh token', result)
    return result;
}

export const handle = run(action);