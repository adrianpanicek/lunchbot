import {run} from '../index';
import {UserRepository} from "../model/User/UserRepository";
import {UserFactory} from "../model/User/UserFactory";
import {UserEmailRepository} from "../model/UserEmail/UserEmailRepository";
import {UserEmailFactory} from "../model/UserEmail/UserEmailFactory";
import {BadRequest, Denied, responseCreated, responseSuccess, Failed} from "../application";
import {firewallFilter} from "../decorator/firewall";
import {SecurityLevels} from "../model/User/User";
import {getRepository} from "../model/Repository";
import {UserRefreshTokenFactory} from "../model/UserRefreshToken/UserRefreshTokenFactory";
import {UserRefreshTokenRepository} from "../model/UserRefreshToken/UserRefreshTokenRepository";
import {UserAccessTokenFactory} from "../model/UserAccessToken/UserAccessTokenFactory";

const factory = new UserFactory();
const emailFactory = new UserEmailFactory();

const action = async (req) => {
    const emailRepository = await getRepository<UserEmailRepository>(UserEmailRepository);
    const repository = await getRepository<UserRepository>(UserRepository);

    const model = await factory.createFromObject(req.body);

    try {
        await model.validate();
    } catch(e) {
        throw new BadRequest(e.message);
    }

    await model.hashPassword();

    const emailModel = emailFactory.createFromUser(model);

    try {
        await emailRepository.save(emailModel);
    } catch (e) {
        throw new Denied('Email already registered');
    }

    try {
        const result = await repository.save(model);
        return responseCreated(firewallFilter(result, SecurityLevels.RESOURCE_OWNER));
    } catch (e) {
        throw new Denied('User Unique ID collision');
    }
};

const login = async (req) => {
    const repository = await getRepository<UserRepository>(UserRepository);
    const model = await factory.createFromObject(req.body);

    const user = await repository.getByEmail(model);
    if (!user) {
        console.log('User with this email not found', model.email);
        throw new Denied('Wrong credentials');
    }

    await model.hashPassword();
    if (model.password !== user.password) {
        console.log('User entered invalid password', model.password, user.password);
        throw new Denied('Wrong credentials')
    }

    const refreshToken = new UserRefreshTokenFactory().createFromObject({user: user.id});

    const refreshTokenRepository = await getRepository<UserRefreshTokenRepository>(UserRefreshTokenRepository);
    await refreshTokenRepository.save(refreshToken);

    const accessTokenFactory = new UserAccessTokenFactory();
    const accessToken = accessTokenFactory.createFromObject({user: user.id});

    return responseSuccess({
        refreshToken: refreshToken.token,
        token: await accessToken.sign()
    });
};

const refreshToken = async ({body: {refreshToken}, user}) => {
    const userRepository = await getRepository<UserRepository>(UserRepository);
    const tokenRepository = await getRepository<UserRefreshTokenRepository>(UserRefreshTokenRepository);

    const savedUser = await userRepository.get(factory.createFromObject({id: user}));
    if (!savedUser) {
        console.error('User with this id not found', user);
        throw new Failed('Unknown error');
    }

    const refreshTokenFactory = new UserRefreshTokenFactory();
    const token = refreshTokenFactory.createFromObject({token: refreshToken})
    const savedToken = await tokenRepository.get(token);
    if (!savedToken) {
        console.error('Refresh token not found in database', refreshToken);
        throw new Denied('Refresh token not found');
    }

    const accessTokenFactory = new UserAccessTokenFactory();
    const accessToken = accessTokenFactory.createFromObject({user});
    return responseCreated({
        token: await accessToken.sign()
    });
};

export const handle = run(action);