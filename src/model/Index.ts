interface SharedIndex {
    name: string,
    type: 'global' | 'local',
    projection: 'all' | 'keys' | Array<string>
};

interface GlobalIndex extends SharedIndex {
    type: 'global';
    readCapacityUnits: number;
    writeCapacityUnits: number;
}

interface LocalIndex extends SharedIndex {
    type: 'local';
}

export type Index = GlobalIndex | LocalIndex;