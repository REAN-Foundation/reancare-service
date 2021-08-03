
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
