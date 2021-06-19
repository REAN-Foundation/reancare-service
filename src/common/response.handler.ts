import express from 'express';

import { Logger } from './logger';
import { ActivityRecorder } from './activity.recorder';
import { InputValidationError } from './input.validation.error';

///////////////////////////////////////////////////////////////////////

export class ResponseHandler {

    public static failure(
        request: express.Request,
        response: express.Response,
        message?: string,
        httpErrorCode?: number,
        error?: Error
    ) {
        var ips = [
            request.header('x-forwarded-for') || request.socket.remoteAddress
        ];
        
        var msg = error? error.message : (message? message : 'An error has occurred.');

        var responseObject = {
            Status: 'failure',
            Message: msg,
            HttpErroCode: httpErrorCode ? httpErrorCode : 500,
            Trace: error ? error.stack : [],
            Client: request ? request.currentClient: null,
            User: request ? request.currentUser : null,
            Context: request ? request.context : null,
            RequestMethod: request ? request.method : null,
            RequestHost: request ? request.hostname: null,
            RequestBody: request ? request.body : null,
            RequestHeaders: request ? request.headers : null,
            RequestUrl: request ? request.originalUrl : null,
            RequestParams: request ? request.params : null,
            ClientIps: request && request.ips.length > 0 ? request.ips: ips,
            APIVersion: process.env.API_VERSION,
            ServiceVersion: process.env.SERVICE_VERSION,
        };
        if (process.env.NODE_ENV != 'test') {
            Logger.instance().log(JSON.stringify(responseObject, null, 2));
        }
        ActivityRecorder.record(responseObject);
        return response.status(httpErrorCode).send(responseObject);
    }

    public static success(
        request: express.Request,
        response: express.Response, 
        message:string, 
        httpCode: number,
        data?: any,
        logDataObject: boolean = true) {

        var ips = [
            request.header('x-forwarded-for') || request.socket.remoteAddress
        ];
       
        var responseObject = {
            Status: 'success',
            Message: message,
            HttpCode: httpCode,
            DataObject: data ? data : null,
            Client: request ? request.currentClient: null,
            User: request ? request.currentUser : null,
            Context: request ? request.context : null,
            RequestMethod: request ? request.method : null,
            RequestHost: request ? request.hostname: null,
            RequestBody: request ? request.body : null,
            RequestHeaders: request ? request.headers : null,
            RequestUrl: request ? request.originalUrl : null,
            RequestParams: request ? request.params : null,
            ClientIps: request && request.ips.length > 0 ? request.ips: ips,
            APIVersion: process.env.API_VERSION,
            ServiceVersion: process.env.SERVICE_VERSION,
        };

        if (process.env.NODE_ENV != 'test') {
            if (!logDataObject) {
                responseObject.DataObject = null;
            }
            Logger.instance().log(JSON.stringify(responseObject, null, 2));
        }
        ActivityRecorder.record(responseObject);
        return response.status(httpCode).send(responseObject);
    }

    static handleError(
        request: express.Request,
        response: express.Response,
        error: Error) {

        if (error instanceof InputValidationError) {
            var validationError = error as InputValidationError;
            ResponseHandler.failure(request, response, validationError.message, validationError.httpErrorCode, error);
        }
        else {
            ResponseHandler.failure(request, response, error.message, 400, error);
        }
    }

}
