import {Model} from './Model';

type Partial<T> = {[key in keyof T]?: T[key]};

export interface Factory<T extends Model> {
    createFromObject(data: Partial<T>): T;
}