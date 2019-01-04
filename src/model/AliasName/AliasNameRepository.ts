import {Repository} from "../Repository";
import {AliasName} from "./AliasName";

export class AliasNameRepository extends Repository<AliasName> {
    protected getHashKey(): keyof AliasName {
        return 'name';
    }

    protected getModelType(): { new(): AliasName } {
        return AliasName;
    }

    protected getThroughput(): { readCapacityUnits: number, writeCapacityUnits: number } {
        return {readCapacityUnits: 3, writeCapacityUnits: 3};
    }
}