export interface AuthResult {
    Result       : boolean;
    Message      : string;
    HttpErrorCode: number;
}

export interface UserAuthorizationOptions {
    Context?: string;
    AllowAnonymous?: boolean;
}

// This enums tells about - who owns a resource
export enum ResourceOwnership {
    Owner  = 'Owner',
    Tenant = 'Tenant',
    System = 'System',
}

// This enums tells about - who can access a resource
export enum ActionScope {
    Owner  = 'Owner',
    Tenant = 'Tenant',
    System = 'System',
    Public = 'Public',
}

export enum RequestType {
    CreateOne  = 'CreateOne',
    CreateMany = 'CreateMany',
    GetOne     = 'GetOne',
    GetMany    = 'GetMany',
    UpdateOne  = 'UpdateOne',
    UpdateMany = 'UpdateMany',
    DeleteOne  = 'DeleteOne',
    DeleteMany = 'DeleteMany',
    Search     = 'Search',
    Custom     = 'Custom',
}

export interface AuthOptions {
    Context                : string | null;
    ActionScope            : ActionScope;
    Ownership              : ResourceOwnership;
    RequestType           ?: RequestType;
    ClientAppAuth          : boolean;
    ResourceIdName        ?: string | number;
    CustomAuthorization   ?: boolean;
    AlternateAuth         ?: boolean;
    SignupOrSignin        ?: boolean;
    OptionalUserAuth      ?: boolean;
}

export const DefaultAuthOptions: AuthOptions = {
    Context             : null,
    ActionScope         : ActionScope.Owner,
    Ownership           : ResourceOwnership.Owner,
    RequestType         : RequestType.Custom,
    ResourceIdName      : 'id',
    ClientAppAuth       : true,
    CustomAuthorization : false,
    AlternateAuth       : false,
    SignupOrSignin      : false,
    OptionalUserAuth    : false,
};
