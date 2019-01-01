import "reflect-metadata";
import * as _ from "lodash";

const firewallMetadataKey = Symbol('firewall');

export function firewall(level: number) {
    return Reflect.metadata(firewallMetadataKey, level);
}

export function firewallFilter(obj: object, level: number) {
    // @ts-ignore
    return _.pickBy(obj, (v, k) => (Reflect.getMetadata(firewallMetadataKey, obj, k) || 0) <= level);
}