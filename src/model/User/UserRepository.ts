import {Repository} from "../Repository";
import {User} from "./User";
import {UserEmailUnique} from "@app/model/User/UserEmailUnique";

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

    async findById(id: string): Promise<User|null> {
        for await (const item of this.find({id})) {
            return item;
        }
        return null;
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

    async checkUniqueEmail(uniqueModel: UserEmailUnique): Promise<boolean> {
        for await (const item of this.find(uniqueModel.createQuery())) {
            console.log(item);
            return false;
        }
        return true;
    }

    async reserveEmail(user: User): Promise<void> {
        const uniqueModel = UserEmailUnique.fromUser(user);
        await this.save(uniqueModel);
    }
}
