import "reflect-metadata";
import * as _ from "lodash";
import {Model} from "../model/Model";

const binaryMetadataKey = Symbol('isBinaryBuffer');

export function binary() {
    return Reflect.metadata(binaryMetadataKey, true);
}

export function serializeBinary(obj: Model) {
    return _(obj)
        .toPlainObject()
        .pickBy(hasMeta(obj))
        .mapValues(v =>
             _.isBuffer(v)? (v as Buffer).toString('base64') : new Buffer(v).toString('base64')
        )
        .value();
}

export function deserializeBinary(obj: Model) {
    return _(obj)
        .toPlainObject()
        .pickBy(hasMeta(obj))
        .mapValues(v =>
            Buffer.from(v, 'base64')
        ).value();
}

const hasMeta = (obj: object) => (val: any, key: string): boolean => Reflect.getMetadata(binaryMetadataKey, obj, key);