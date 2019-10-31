import {
    table,
} from '@aws/dynamodb-data-mapper-annotations';
import {User} from "@app/model/User/User";

const KEY_PREFIX = 'email#';

@table('users')
export class UserEmailUnique extends User {
    public static fromUser(user: User): UserEmailUnique {
        const entity = new this;
        entity.id = KEY_PREFIX + user.email;

        return entity
    }

    public createQuery(): Partial<User> {
        return {id: this.id};
    }
}