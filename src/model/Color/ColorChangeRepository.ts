import {Repository} from "../Repository";
import {ColorChange} from "@app/model/Color/ColorChange";

export class ColorChangeRepository extends Repository<ColorChange> {
    protected getModelType(): { new(): ColorChange } {
        return ColorChange;
    }

    protected getHashKey(): keyof ColorChange {
        return 'xy';
    }

    protected getThroughput(): { readCapacityUnits: number, writeCapacityUnits: number } {
        return {readCapacityUnits: 50, writeCapacityUnits: 50};
    }
}
