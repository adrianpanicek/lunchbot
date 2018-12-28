import {run} from '../index';
import {UserRepository} from "../model/User/UserRepository";
import {UserFactory} from "../model/User/UserFactory";
import {UserEmailRepository} from "../model/UserEmail/UserEmailRepository";
import {UserEmailFactory} from "../model/UserEmail/UserEmailFactory";
import {validate} from "class-validator";
import {Denied, responseCreated} from "../application";
import {firewallFilter} from "../firewall";
import {SecurityLevels} from "../model/User/User";

const action = async (req) => {
    const factory = new UserFactory();
    const model = await factory.createFromObject(req.body);
    await validate(model);

    // TODO: Remove
    const response = firewallFilter(model, SecurityLevels.RESOURCE_OWNER);
    return responseCreated(response);

    const emailRepository = new UserEmailRepository();
    await emailRepository.createTable();
    const emailFactory = new UserEmailFactory();
    const emailModel = emailFactory.createFromUser(model);

    try {
        await emailRepository.save(emailModel);
    } catch (e) {
        throw new Denied('Email already registered');
    }

    const repository = new UserRepository();
    await repository.createTable();

    try {
        const result = await repository.save(model);

    } catch (e) {
        throw new Denied('User Unique ID collision');
    }
};

export const handle = run(action);