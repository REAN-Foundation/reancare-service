import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class CourseContentAuth {

static _baseContext = `Educational.CourseContent`;

static create: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Create`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.CreateOne,
};

static update: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Update`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.UpdateOne,
};

static delete: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Delete`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.DeleteOne,
};

static getById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetById`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static getContentsForCourse: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetContentsForCourse`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static getContentsForLearningPath: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetContentsForLearningPath`,
    Ownership   : ResourceOwnership.Tenant,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.Search`,
    Ownership           : ResourceOwnership.Tenant,
    ActionScope         : ActionScope.Tenant,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

}
