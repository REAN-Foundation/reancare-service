import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CohortAuth {

static _baseContext = `Community.Cohort`;

static create: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Create`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static update: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Update`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.UpdateOne,
};

static delete: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Delete`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.DeleteOne,
};

static getById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetById`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static getCohortStats: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetCohortStats`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static getCohortUsers: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetCohortUsers`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static addUserToCohort: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.AddUserToCohort`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static removeUserFromCohort: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.RemoveUserFromCohort`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static getCohortsForTenant: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetCohortsForTenant`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.Search`,
    Ownership           : ResourceOwnership.System,
    ActionScope         : ActionScope.Tenant,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

}
