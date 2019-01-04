import {Model} from "./Model";

// TODO: Temp, move to other file
import {CreateTableOptions, DataMapper, QueryIterator, QueryOptions} from "@aws/dynamodb-data-mapper";
import {DynamoDB} from 'aws-sdk';
import {ConditionExpression} from "@aws/dynamodb-expressions";
import * as _ from "lodash";
import {Index} from "./Index";

const {TABLE_PREFIX} = process.env;
const mapper = new DataMapper({client: new DynamoDB, readConsistency: "strong", tableNamePrefix: TABLE_PREFIX});

export abstract class Repository<T extends Model> {
    protected abstract getModelType(): new () => T;
    protected abstract getHashKey(): keyof T;
    protected abstract getThroughput(): {readCapacityUnits: number, writeCapacityUnits: number};

    protected getIndexes(): {[key: string]: Index} {
        const defaultThroughput = this.getThroughput();

        return _.mapValues(
            // @ts-ignore
            this.getModelType().indexes,
            (i: Index) => i.type === 'global' ? {...defaultThroughput, ...i} : i
        )
    }

    protected getUniqueCondition(): ConditionExpression {
        return {
            type: 'Function',
            subject: (this.getHashKey() as string),
            name: 'attribute_not_exists'
        };
    }

    createTable(options?: CreateTableOptions): Promise<void> {
        const type = this.getModelType();

        return mapper.ensureTableExists(type, {
            // @ts-ignore
            indexOptions: this.getIndexes(),
            ...this.getThroughput(),
            ...options
        });
    }

    save(model: T): Promise<T> {
        return mapper.put(model, {condition: this.getUniqueCondition()});
    }

    update(model: T): Promise<T> {
        return mapper.put(model, {});
    }

    get(model: T): Promise<T> {
        return mapper.get(model, {});
    }

    getConsistent(model: T): Promise<T> {
        return mapper.get(model, {readConsistency: 'strong'});
    }

    delete(model: T): Promise<T> {
        return mapper.delete(model, {});
    }

    find(keyCondition: {[key: string]: any}): QueryIterator<T> {
        return mapper.query(this.getModelType(), keyCondition, {});
    }

    findByIndex(keyCondition: Partial<T>, index: Index, options: QueryOptions = {}): QueryIterator<T> {
        const search: ConditionExpression = {
            subject: _.keys(keyCondition)[0],
            type: "Equals",
            object: _.values(keyCondition)[0]
        };
        return mapper.query(this.getModelType(), search, {
            indexName: index.name,
            readConsistency: index.type === 'local'? 'strong' : 'eventual', // Strong consistency not supported on global
            ...options
        });
    }

    async init(): Promise<void> {
        await this.createTable();
    }
}

const repositoryContainer = {};
// @ts-ignore TODO: Find out how to do this properly
export const getRepository = async <T extends Repository>(repo: new () => T): Promise<T> => {
    if (repositoryContainer[repo.name]) {
        return repositoryContainer[repo.name];
    }

    const instance = new repo;
    await instance.init();
    repositoryContainer[repo.name] = instance;

    return repositoryContainer[repo.name];
}