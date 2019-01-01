import {Factory} from "../Factory";
import {UserStash} from "./UserStash";

export class UserStashFactory implements Factory<UserStash> {
    createFromObject(data: Partial<UserStash>): UserStash {
        return Object.assign(new UserStash, data);
    }
}