import {Factory} from "../Factory";
import {User} from "./User";
import {v4 as uuid} from "uuid";

export class UserFactory implements Factory<User> {
    createFromObject(data: Partial<User>): User {
        if(!data.id)
            data.id = uuid();

        return Object.assign(new User, data);
    }
}