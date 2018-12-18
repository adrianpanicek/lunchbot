import {run} from '../index';
import {responseSuccess} from "../application";

const action = (req) => responseSuccess("Hello " + req.params.name);

export const handle = run(action);