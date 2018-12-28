import {Factory} from "../Factory";
import {UserEmail} from "./UserEmail";
import {User} from "../User/User";

export class UserEmailFactory implements Factory<UserEmail> {
    createFromObject(data: Partial<UserEmail>): UserEmail {
        return Object.assign(new UserEmail, data);
    }

    createFromUser(user: User): UserEmail {
        const model = new UserEmail;
        model.email = user.email;
        model.user_id = user.id;

        return model;
    }
}