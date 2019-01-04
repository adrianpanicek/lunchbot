import {Factory} from "../Factory";
import {AliasName} from "./AliasName";
import {Alias} from "../Alias/Alias";

export class AliasNameFactory implements Factory<AliasName> {
    createFromObject(data: Partial<AliasName>): AliasName {
        return Object.assign(new AliasName, data);
    }

    createFromAlias(alias: Alias): AliasName {
        const name = new AliasName;
        name.name = alias.aliasName;
        name.alias = alias.id;

        return name;
    }
}