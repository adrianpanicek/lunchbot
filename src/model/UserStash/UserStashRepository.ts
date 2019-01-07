import {Repository} from "../Repository";
import {UserStash} from "./UserStash";
import {VersionMismatch} from "./VersionMismatch";

export class UserStashRepository extends Repository<UserStash> {
    protected getHashKey(): keyof UserStash {
        return 'user';
    }

    protected getModelType(): { new(): UserStash } {
        return UserStash;
    }

    protected getThroughput(): { readCapacityUnits: number, writeCapacityUnits: number } {
        return {readCapacityUnits: 5, writeCapacityUnits: 5};
    }

    async update(stash: UserStash): Promise<UserStash> {
        const search = {user: stash.user};
        const index = UserStash.indexes.OnlyVersionByCreatedIndex;
        const options = {scanIndexForward: false};

        let prevStash: UserStash;
        for await (const s of this.findByIndex(search, index, options)) {
            prevStash = s;
            break;
        }

        if (prevStash && prevStash.versionToken !== stash.previousVersionToken) {
            throw new VersionMismatch('Parameter previousVersionToken does not match version of last stash recorded');
        }

        return await this.save(stash);
    }

    async rollback(stash: UserStash): Promise<UserStash> {
        return await this.delete(stash);
    }

    async getLatest(stash: UserStash): Promise<UserStash|null> {
        const search = {user: stash.user};
        const index = UserStash.indexes.ByCreatedIndex;
        const options = {scanIndexForward: false};

        for await (const s of this.findByIndex(search, index, options)) {
            return s;
        }

        return null;
    }
}