import { run } from '../index';
import { responseSuccess } from "../application";
const action = (req) => responseSuccess("Hello");
export const handle = run(action);
//# sourceMappingURL=test.js.map