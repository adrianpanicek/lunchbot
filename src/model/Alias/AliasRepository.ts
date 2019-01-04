import {Repository} from "../Repository";
import {Alias} from "./Alias";

export class AliasRepository extends Repository<Alias> {
    protected getHashKey(): keyof Alias {
        return 'id';
    }

    protected getModelType(): { new(): Alias } {
        return Alias;
    }

    protected getThroughput(): { readCapacityUnits: number, writeCapacityUnits: number } {
        return {readCapacityUnits: 5, writeCapacityUnits: 5};
    }
}