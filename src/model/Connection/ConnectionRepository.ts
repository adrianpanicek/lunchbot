import {Repository} from "@app/model/Repository";
import {Connection} from "@app/model/Connection/Connection";

export class ConnectionRepository extends Repository<Connection> {
    protected getHashKey(): keyof Connection {
        return 'id';
    }

    protected getModelType(): { new(): Connection } {
        return Connection;
    }

    protected getThroughput(): { readCapacityUnits: number, writeCapacityUnits: number } {
        return {readCapacityUnits: 10, writeCapacityUnits: 10};
    }
}