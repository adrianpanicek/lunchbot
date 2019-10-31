import {run} from "@app/index";
import {BadRequest, Conflict, Denied, responseCreated} from "@app/application";
import {getRepository} from "@app/model/Repository";
import {UserRepository} from "@app/model/User/UserRepository";
import {firewallFilter} from "@app/decorator/firewall";
import {SecurityLevels} from "@app/model/User/User";
import {UserFactory} from "@app/service/UserFactory";
import {UserEmailUnique} from "@app/model/User/UserEmailUnique";

const action = async (req) => {
    const userRepository = await getRepository<UserRepository>(UserRepository);
    const userFactory = new UserFactory();

    const model = await userFactory.createFromObject(req.body);

    try {
        await model.validate();
    } catch(e) {
        throw new BadRequest(e.message);
    }

    model.salt = await model.createSalt();
    model.password = await model.hashPassword(model.password, model.salt);

    const emailUnique = UserEmailUnique.fromUser(model);
    if (!await userRepository.checkUniqueEmail(emailUnique)) {
        throw new Conflict('Email already registered');
    }

    try {
        const result = await userRepository.save(model);
        await userRepository.reserveEmail(model);

        return responseCreated(firewallFilter(result, SecurityLevels.RESOURCE_OWNER));
    } catch (e) {
        throw new Denied('User Unique ID collision');
    }
};

export const handle = run(action);