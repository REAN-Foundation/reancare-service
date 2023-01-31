import express from 'express';
import { Authorizer } from '../auth/authorizer';
import { ApiError } from '../common/api.error';
import { Loader } from '../startup/loader';

///////////////////////////////////////////////////////////////////////////////////////

export class BaseController {

    _authorizer: Authorizer = null;

    constructor() {
        this._authorizer = Loader.authorizer;
    }

    setContext = async (
        context: string,
        request: express.Request,
        response: express.Response,
        authorize = true) => {

        if (context === undefined || context === null) {
            throw new ApiError(500, 'Invalid request context');
        }
        const tokens = context.split('.');
        if (tokens.length < 2) {
            throw new ApiError(500, 'Invalid request context');
        }
        const resourceType = tokens[0];
        request.context = context;
        request.resourceType = resourceType;
        if (request.params.id !== undefined && request.params.id !== null) {
            request.resourceId = request.params.id;
        }
        if (authorize) {
            await Loader.authorizer.authorize(request, response);
        }
    };

}
