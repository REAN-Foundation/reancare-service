export interface AuthenticationResult {
    Result       : boolean;
    Message      : string;
    HttpErrorCode: number;
}

export interface UserAuthorizationOptions {
    Context       ?: string;
    AllowAnonymous?: boolean;
}
