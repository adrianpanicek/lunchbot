import {Application, action} from '../framework/index';
import {router} from "./router";

const app = new Application;

app.use(async (req, next) => await next({...req})); // clean middleware
app.use(async (req, next) => {
    console.log('before', req);
    req.test = 1;
    return await next({...req});
}); // before middleware

app.use(action((req) => {
    return {some: 'shit'};
})); // action

app.use(async (req, next) => {
    let res = await next({...req});
    console.log('after', req)
    res.response = 1;
    return res;
}); // after middleware

export const handle = (event, context) => {
    console.log(event, context);
    router(event);
    app.run(event).then(console.log);
}