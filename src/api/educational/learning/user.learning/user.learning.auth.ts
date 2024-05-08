import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class UserLearningAuth {

    static readonly _baseContext = `Educational.UserLearning`;

    static readonly updateUserLearning: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateUserLearning`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly getUserLearningPaths: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserLearningPaths`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly getUserCourseContents: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetUserCourseContents`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly getLearningPathProgress: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetLearningPathProgress`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly getCourseProgress: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetCourseProgress`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly getModuleProgress: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetModuleProgress`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly getContentProgress: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetContentProgress`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

}
