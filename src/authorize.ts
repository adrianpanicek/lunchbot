import {AuthResponse, CustomAuthorizerEvent} from "aws-lambda";
import {AccessToken} from "./model/User/AccessToken";

const generatePolicy = (principalId: string, effect: string, resource: any): AuthResponse => {
    const authResponse: AuthResponse = {
        principalId,
        policyDocument: null
    };

    if (!effect || !resource) {
        return authResponse;
    }

    authResponse.policyDocument = {
        Version: '2012-10-17', // From documentation
        Statement: [{
            Action: 'execute-api:Invoke', // This authorizes user to invoke lambdas
            Effect: effect,
            Resource: resource
        }]
    };

    return authResponse;
};

export function handle({authorizationToken, methodArn, headers}: CustomAuthorizerEvent, context, callback) {
    const token = authorizationToken || headers['Authorization']; // This is ugly hack, but enough for now
    if (!token) {
        throw new Error('Authorization token not provided');
    }

    const stringToken = token.replace(/^Bearer /, '');
    try {
        const {user} = AccessToken.fromString(stringToken);

        console.log('Allowed access to ' + methodArn + ' for ' + user);
        callback(null, generatePolicy(user, 'Allow', '*')); // Todo: This allows user to access any resource, change it to exact ARNs
    } catch (e) {
        console.log('Refused authentication for token ' + stringToken, e);
        callback(JSON.stringify(e));
    }
}

