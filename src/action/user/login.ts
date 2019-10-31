import {responseSuccess, Denied} from "@app/application";
import {run} from "@app/index";
import {getRepository} from "@app/model/Repository";
import {UserRepository} from "@app/model/User/UserRepository";
import {UserFactory} from "@app/service/UserFactory";
import {UserAccessTokenFactory} from "@app/service/UserAccessTokenFactory";
import {User} from "@app/model/User/User";

export const action = async (req) => {
    const userFactory = new UserFactory();

    const model = userFactory.createFromObject(req.body);
    const repository = await getRepository<UserRepository>(UserRepository);

    const user = await findUser(repository, model);
    await authorizeUser(model, user);
    const refreshToken = addRefreshToken(user);
    await repository.update(user);
    const accessToken = await createAccessToken(user);

    return responseSuccess({
        refreshToken: refreshToken,
        accessToken: accessToken
    });
};

async function findUser(repository: UserRepository, inputModel: User): Promise<User> {
    console.log("Looking for user");
    const user = await repository.getByEmail(inputModel);
    if (!user) {
        console.log('User with this email not found', inputModel.email);
        throw new Denied('Wrong credentials');
    }

    return user;
}

async function authorizeUser(model: User, user: User): Promise<void> {
    console.log("Authorizing user");
    const hashedPassword = await model.hashPassword(model.password, user.salt);
    if (hashedPassword !== user.password) {
        console.log('User entered invalid password', model.password, user.password);
        throw new Denied('Wrong credentials')
    }
}

function addRefreshToken(user: User): string {
    console.log("Adding refresh token");
    const refreshToken = user.createRefreshToken();
    user.refreshTokens.add(refreshToken);
    console.log("Refresh token added");

    return refreshToken;
}

async function createAccessToken(user: User): Promise<string> {
    console.log("Creating access token");
    const userAccessTokenFactory = new UserAccessTokenFactory();
    const accessToken = userAccessTokenFactory.fromUser(user);

    return await accessToken.sign();
}

export const handle = run(action);