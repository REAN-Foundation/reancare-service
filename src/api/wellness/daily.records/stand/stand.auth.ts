import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class StandAuth {

static readonly _baseContext = `Wellness.DailyRecords.Stand`;

static readonly create: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Create`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static readonly update: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Update`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.UpdateOne,
};

static readonly delete: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Delete`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.DeleteOne,
};

static readonly getById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetById`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.Search`,
    Ownership           : ResourceOwnership.System,
    ActionScope         : ActionScope.Public,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

}
