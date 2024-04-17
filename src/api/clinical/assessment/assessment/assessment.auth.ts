import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentAuth {

    static _baseContext = `Clinical.Assessments.Assessment`;

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.Search`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static startAssessment: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.StartAssessment`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.UpdateOne,
        CustomAuthorization : true,
    };

    static scoreAssessment: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.ScoreAssessment`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.UpdateOne,
        CustomAuthorization : true,
    };

    static getNextQuestion: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.GetNextQuestion`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.GetOne,
        CustomAuthorization : true,
    };

    static getQuestionById: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.GetQuestionById`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.GetOne,
        CustomAuthorization : true,
    };

    static answerQuestion: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.AnswerQuestion`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.UpdateOne,
        CustomAuthorization : true,
    };

    static answerQuestionList: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.AnswerQuestionList`,
        Ownership           : ResourceOwnership.Owner,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.UpdateOne,
        CustomAuthorization : true,
    };
    
}
