import {getRepository} from "@app/model/Repository";
import {ColorChangeRepository} from "@app/model/Color/ColorChangeRepository";
import {ColorChange} from "@app/model/Color/ColorChange";

export async function handle(event) {
    const repository = await getRepository<ColorChangeRepository>(ColorChangeRepository);
    for await (const color of repository.scan({})) {
        console.log(color);
    }
}