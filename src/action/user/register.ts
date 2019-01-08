import {run} from "@app/index";
import {BadRequest, Denied, responseCreated} from "@app/application";
import {getRepository} from "@app/model/Repository";
import {UserEmailRepository} from "@app/model/UserEmail/UserEmailRepository";
import {UserRepository} from "@app/model/User/UserRepository";
import {firewallFilter} from "@app/decorator/firewall";
import {SecurityLevels} from "@app/model/User/User";
import {UserFactory} from "@app/model/User/UserFactory";
import {UserEmailFactory} from "@app/model/UserEmail/UserEmailFactory";

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