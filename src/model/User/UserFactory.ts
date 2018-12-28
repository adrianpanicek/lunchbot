import {Factory} from "../Factory";
import {User} from "./User";

export class UserFactory implements Factory<User> {
    createFromObject(data: Partial<User>): User {
        return Object.assign(new User, data);
    }
}