import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CohortAuth {

static readonly _baseContext = `Community.Cohort`;

static readonly create: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Create`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static readonly update: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Update`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.UpdateOne,
};

static readonly delete: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Delete`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.DeleteOne,
};

static readonly getById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetById`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static readonly getCohortStats: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetCohortStats`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly getCohortUsers: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetCohortUsers`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly addUserToCohort: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.AddUserToCohort`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static readonly removeUserFromCohort: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.RemoveUserFromCohort`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static readonly getCohortsForTenant: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetCohortsForTenant`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.Search`,
    Ownership           : ResourceOwnership.System,
    ActionScope         : ActionScope.Tenant,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

}
