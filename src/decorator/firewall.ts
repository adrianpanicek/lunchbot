import "reflect-metadata";
import * as _ from "lodash";

const createSymbol = (action: string): Symbol => Symbol('firewall-' + action);

export function firewall(level: number, action: string = 'default') {
    return Reflect.metadata(createSymbol(action), action + level);
}

export function firewallFilter(obj: object, level: number, action: string = 'default') {
    return _.pickBy(obj, (v, k) => (Reflect.getMetadata(createSymbol(action), obj, k) || 0) <= level);
}