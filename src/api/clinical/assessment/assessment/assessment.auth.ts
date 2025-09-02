import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentAuth {

    static readonly _baseContext = `Clinical.Assessments.Assessment`;

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
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
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static readonly startAssessment: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.StartAssessment`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.UpdateOne,
        CustomAuthorization : true,
    };

    static readonly scoreAssessment: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.ScoreAssessment`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.UpdateOne,
        CustomAuthorization : true,
    };

    static readonly getNextQuestion: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.GetNextQuestion`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.GetOne,
        CustomAuthorization : true,
    };

    static readonly getQuestionById: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.GetQuestionById`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.GetOne,
        CustomAuthorization : true,
    };

    static readonly answerQuestion: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.AnswerQuestion`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.UpdateOne,
        CustomAuthorization : true,
    };

    static readonly answerQuestionList: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.AnswerQuestionList`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.UpdateOne,
        CustomAuthorization : true,
    };

    static readonly skipQuestion: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.SkipQuestion`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.UpdateOne,
        CustomAuthorization : true,
    };

}
