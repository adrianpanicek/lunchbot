import {responseSuccess, Denied} from "@app/application";
import {run} from "@app/index";
import {getRepository} from "@app/model/Repository";
import {User} from "@app/model/User/User";
import {ColorChangeRepository} from "@app/model/Color/ColorChangeRepository";
import {ColorChange} from "@app/model/Color/ColorChange";
import {Coordinates} from "@app/model/Color/Coordinates";

export const action = async (req) => {
    const {body: {x, y, c}} = req;

    const repository = await getRepository<ColorChangeRepository>(ColorChangeRepository);

    const user = new User();
    user.id = req.user;

    const model = ColorChange.create(new Coordinates(x, y), c, user);
    const result = await repository.save(model);

    return responseSuccess(result);
};

export const handle = run(action);