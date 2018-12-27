import { verify } from "./user/token";
const generatePolicy = (principalId, effect, resource) => {
    const authResponse = {
        principalId,
        policyDocument: null
    };
    if (!effect || !resource) {
        return authResponse;
    }
    authResponse.policyDocument = {
        Version: '2012-10-17',
        Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource
            }]
    };
    return authResponse;
};
export function handle({ authorizationToken, methodArn }, context, callback) {
    if (!authorizationToken) {
        throw new Error('Unauthorized');
    }
    const stringToken = authorizationToken.replace(/^Bearer /, '');
    try {
        let { identificator } = verify(stringToken);
        console.log('Allowed access to ' + methodArn + ' for ' + identificator);
        callback(null, generatePolicy(identificator, 'Allow', '*')); // Todo: This allows user to access any resource, change it to exact ARNs
    }
    catch (e) {
        console.log('Refused authentication for token ' + stringToken, e);
        callback(JSON.stringify(e));
    }
}
//# sourceMappingURL=authorize.js.map