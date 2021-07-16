export class ApiError extends Error {

    _errorMessage: string = 'An unexpected error has occurred.';
    _httpErrorCode: number = 500;

    constructor(httpErrorCode: number, errorMessage: string){
        super();
        this._httpErrorCode = httpErrorCode;
        this._errorMessage = errorMessage;
        this.message = errorMessage;
    }

    public get errorMessage() {
        return this._errorMessage;
    }

    public get httpErrorCode() {
        return this._httpErrorCode;
    }
}
