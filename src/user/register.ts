import {run} from "../index";
import {BadRequest, Denied, responseCreated} from "../application";
import {getRepository} from "../model/Repository";
import {UserEmailRepository} from "../model/UserEmail/UserEmailRepository";
import {UserRepository} from "../model/User/UserRepository";
import {firewallFilter} from "../decorator/firewall";
import {SecurityLevels} from "../model/User/User";
import {UserFactory} from "../model/User/UserFactory";
import {UserEmailFactory} from "../model/UserEmail/UserEmailFactory";

const action = async (req) => {
    const emailRepository = await getRepository<UserEmailRepository>(UserEmailRepository);
    const userRepository = await getRepository<UserRepository>(UserRepository);
    const userFactory = new UserFactory();
    const userEmailFactory = new UserEmailFactory();

    const model = await userFactory.createFromObject(req.body);

    try {
        await model.validate();
    } catch(e) {
        throw new BadRequest(e.message);
    }

    await model.hashPassword();

    const emailModel = userEmailFactory.createFromUser(model);

    try {
        await emailRepository.save(emailModel);
    } catch (e) {
        throw new Denied('Email already registered');
    }

    try {
        const result = await userRepository.save(model);
        return responseCreated(firewallFilter(result, SecurityLevels.RESOURCE_OWNER));
    } catch (e) {
        throw new Denied('User Unique ID collision');
    }
};

export const handle = run(action);