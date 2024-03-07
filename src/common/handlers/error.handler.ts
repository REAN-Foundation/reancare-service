import { Logger } from '../../common/logger';

////////////////////////////////////////////////////////////////////////

export class ApiError extends Error {

    Trace: string[] = [];

    Code = 500;

    constructor(errorCode: number, message: string, error: Error = null) {
        super();
        this.message = message ?? 'An unexpected error has occurred. ';
        this.message = this.message + (error != null ? '> ' + error.message : '');
        this.Trace = error != null ? error.stack?.split('\n') : [];
        this.Code = errorCode ?? 500;
    }

}

////////////////////////////////////////////////////////////////////////

export class InputValidationError extends Error {

    _errorMessages: string[] = [];

    _httpErrorCode = 422;

    constructor(errorMessages: string[]){
        super();
        this._errorMessages = errorMessages;
        const str = JSON.stringify(this._errorMessages, null, 2);
        this.message = 'Input validation errors: ' + str;
    }

    public get errorMessages() {
        return this._errorMessages;
    }

    public get httpErrorCode() {
        return this._httpErrorCode;
    }

}

////////////////////////////////////////////////////////////////////////

export class ErrorHandler {

    static throwInputValidationError = (errorMessages) => {
        var message = 'Validation error has occurred!\n';
        if (errorMessages) {
            if (this.isArrayOfStrings(errorMessages)) {
                message += ' ' + errorMessages.join(' ');
            }
            else {
                message += ' ' +  errorMessages.toString();
            }
            message = message.split('"').join('');
        }
        throw new ApiError(422, message);
    };

    static throwDuplicateUserError = (message) => {
        throw new ApiError(422, message);
    };

    static throwNotFoundError = (message) => {
        throw new ApiError(404, message);
    };

    static throwUnauthorizedUserError = (message) => {
        throw new ApiError(401, message);
    };

    static throwForebiddenAccessError = (message) => {
        throw new ApiError(403, message);
    };

    static throwDbAccessError = (error) => {
        throw new ApiError(500, error);
    };

    static throwConflictError = (message) => {
        throw new ApiError(409, message);
    };

    static throwFailedPreconditionError = (message) => {
        throw new ApiError(412, message);
    };

    static throwInternalServerError = (error = null) => {
        throw new ApiError(500, error);
    };

    static handleValidationError = (error) => {
        if (error.isJoi === true) {
            Logger.instance().log(error.message);
            const errorMessages = error.details.map(x => x.message);
            ErrorHandler.throwInputValidationError(errorMessages);
        }
        else {
            ErrorHandler.throwInputValidationError(error.message);
        }
    };

    static handleValidationError_ExpressValidator = (result) => {
        let index = 1;
        const errorMessages = [];
        for (const er of result.errors) {
            errorMessages.push(` ${index}. ${er.msg} - <${er.value}> for <${er.param}> in ${er.location}`);
            index++;
        }
        ErrorHandler.throwInputValidationError(errorMessages);
    };

    static isArrayOfStrings = (arr) => {
        return Array.isArray(arr) && arr.every(item => typeof item === 'string');
    };

}
