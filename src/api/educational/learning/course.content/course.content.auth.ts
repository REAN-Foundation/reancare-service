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

static getContentsForCourse: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetContentsForCourse`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static getContentsForLearningPath: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetContentsForLearningPath`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Public,
    RequestType : RequestType.GetOne,
};

static search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.Search`,
    Ownership           : ResourceOwnership.System,
    ActionScope         : ActionScope.Public,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

}
