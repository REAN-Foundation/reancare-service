import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserLearningAuth {

static _baseContext = `Educational.Learning.UserLearning`;

static updateUserLearning: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.UpdateUserLearning`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static getUserLearningPaths: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetUserLearningPaths`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static getUserCourseContents: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetUserCourseContents`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static getLearningPathProgress: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetLearningPathProgress`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static getCourseProgress: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetCourseProgress`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static getModuleProgress: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetModuleProgress`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

static getContentProgress: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.GetContentProgress`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.GetOne,
};

}
