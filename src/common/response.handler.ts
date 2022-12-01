import express from 'express';
import { ResponseDto } from '../domain.types/miscellaneous/response.dto';
import { ActivityRecorder } from './activity.recorder';
import { ApiError } from './api.error';
import { InputValidationError } from './input.validation.error';
import { Logger } from './logger';

///////////////////////////////////////////////////////////////////////

export class ResponseHandler {

    public static failure(
        request: express.Request,
        response: express.Response,
        message?: string,
        httpErrorCode?: number,
        error?: Error
    ) {
        const ips = [
            request.header('x-forwarded-for') || request.socket.remoteAddress
        ];

        const msg = error ? error.message : (message ? message : 'An error has occurred.');

        const errorStack = error ? error.stack : '';
        const tmp = errorStack.split('\n');
        const trace_path = tmp.map(x => x.trim());

        const responseObject: ResponseDto = {
            Status   : 'failure',
            Message  : msg,
            HttpCode : httpErrorCode ? httpErrorCode : 500,
            Trace    : trace_path,
            Client   : request ? request.currentClient : null,
            User     : request ? request.currentUser : null,
            Context  : request ? request.context : null,
            Request  : {
                Method  : request ? request.method : null,
                Host    : request ? request.hostname : null,
                Body    : request ? request.body : null,
                Headers : request ? request.headers : null,
                Url     : request ? request.originalUrl : null,
                Params  : request ? request.params : null,
            },
            ClientIps      : request && request.ips.length > 0 ? request.ips : ips,
            APIVersion     : process.env.API_VERSION,
            ServiceVersion : process.env.SERVICE_VERSION,
        };

        if (process.env.NODE_ENV !== 'test') {
            Logger.instance().log(JSON.stringify(responseObject, null, 2));
        }

        ActivityRecorder.record(responseObject);

        //Sanitize response: Don't send request and trace related info in response, only use it for logging
        delete responseObject.Request;
        delete responseObject.Trace;

        return response.status(httpErrorCode).send(responseObject);
    }

    public static success(
        request: express.Request,
        response: express.Response,
        message:string,
        httpCode: number,
        data?: any,
        logDataObject = true) {

        const ips = [
            request.header('x-forwarded-for') || request.socket.remoteAddress
        ];

        const responseObject: ResponseDto = {
            Status   : 'success',
            Message  : message,
            HttpCode : httpCode ?? 200,
            Data     : data ?? null,
            Trace    : null,
            Client   : request ? request.currentClient : null,
            User     : request ? request.currentUser : null,
            Context  : request ? request.context : null,
            Request  : {
                Method  : request ? request.method : null,
                Host    : request ? request.hostname : null,
                Body    : request ? request.body : null,
                Headers : request ? request.headers : null,
                Url     : request ? request.originalUrl : null,
                Params  : request ? request.params : null,
            },
            ClientIps      : request && request.ips.length > 0 ? request.ips : ips,
            APIVersion     : process.env.API_VERSION,
            ServiceVersion : process.env.SERVICE_VERSION,
        };

        if (process.env.NODE_ENV !== 'test') {
            if (!logDataObject) {
                responseObject.Data = null;
            }
            Logger.instance().log(JSON.stringify(responseObject, null, 2));
        }

        ActivityRecorder.record(responseObject);

        //Sanitize response: Don't send request and trace related info in response, only use it for logging
        delete responseObject.Request;
        delete responseObject.Trace;

        return response.status(httpCode).send(responseObject);
    }

    static handleError(
        request: express.Request,
        response: express.Response,
        error: Error) {

        if (error instanceof InputValidationError) {
            const validationError = error as InputValidationError;
            ResponseHandler.failure(request, response, validationError.message, validationError.httpErrorCode, error);
        }
        else if (error instanceof ApiError) {
            var err = error as ApiError;
            ResponseHandler.failure(request, response, err.errorMessage, err.httpErrorCode, error);
        }
        else {
            ResponseHandler.failure(request, response, error?.message, 400, error);
        }
    }

}
