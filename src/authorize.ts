import {AuthResponse, CustomAuthorizerEvent} from "aws-lambda";
import {UserToken} from "./user/model";
import {verify} from "./user/token";

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

export function handle({authorizationToken, methodArn}: CustomAuthorizerEvent, context, callback) {
    if (!authorizationToken) {
        throw new Error('Unauthorized');
    }

    const stringToken = authorizationToken.replace(/^Bearer /, '');
    try {
        let {identificator}: UserToken = verify(stringToken);

        console.log('Allowed access to ' + methodArn + ' for ' + identificator);
        callback(null, generatePolicy(identificator, 'Allow', '*')); // Todo: This allows user to access any resource, change it to exact ARNs
    } catch (e) {
        console.log('Refused authentication for token ' + stringToken);
        callback(JSON.stringify(e));
    }
}

