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

    async getByEmail(user: User): Promise<User|null> {
        let result: User = null;
        for await (const item of this.findByIndex({email: user.email}, User.indexes.EmailIndex)) {
            if(result)
                console.error('User email not unique', user.email);

            result = item;
        }
        return result;
    }
}
