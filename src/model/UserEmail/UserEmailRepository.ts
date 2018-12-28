import {Repository} from "../Repository";
import {UserEmail} from "./UserEmail";

export class UserEmailRepository extends Repository<UserEmail> {
    protected getHashKey(): keyof UserEmail {
        return 'email';
    }

    protected getModelType(): { new(): UserEmail } {
        return UserEmail;
    }

    protected getThroughput(): { readCapacityUnits: number, writeCapacityUnits: number } {
        return {readCapacityUnits: 3, writeCapacityUnits: 3};
    }
}