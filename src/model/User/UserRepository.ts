import {Repository} from "../Repository";
import {User} from "./User";

export class UserRepository extends Repository<User> {
    protected getModelType(): { new(): User } {
        return User;
    }

    protected getHashKey(): keyof User {
        return 'id';
    }

    protected getThroughput(): { readCapacityUnits: number, writeCapacityUnits: number } {
        return {readCapacityUnits: 5, writeCapacityUnits: 5};
    }
}