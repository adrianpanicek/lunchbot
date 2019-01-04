import {Factory} from "../Factory";
import {Alias} from "./Alias";

export class AliasFactory implements Factory<Alias> {
    createFromObject(data: Partial<Alias>): Alias {
        return Object.assign(new Alias, data);
    }
}