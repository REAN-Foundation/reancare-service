import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateAuth {

    static readonly _baseContext = `Clinical.Assessments.AssessmentTemplate`;

    static readonly create: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Create`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly update: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Update`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.Search`,
        Ownership           : ResourceOwnership.Tenant,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static readonly addNode: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.AddNode`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,

    };

    static readonly deleteNode: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteNode`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly searchNodes: AuthOptions = {
        ...DefaultAuthOptions,
        Context             : `${this._baseContext}.SearchNode`,
        Ownership           : ResourceOwnership.Tenant,
        ActionScope         : ActionScope.Tenant,
        RequestType         : RequestType.Search,
        CustomAuthorization : true,
    };

    static readonly getNode: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetNode`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly updateNode: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateNode`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly setNextNodeToPath: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.SetNextNodeToPath`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly addPathCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.AddPathCondition`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly updatePathCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdatePathCondition`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly getPathCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPathCondition`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly deletePathCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeletePathCondition`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly getPathConditionsForPath: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetConditionsForPath`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static readonly getNodePaths: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetNodePaths`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetMany,
    };

    static readonly addPath: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.AddPath`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly deletePath: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeletePath`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly updatePath: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdatePath`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly getPath: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetPath`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly addScoringCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.AddScoringCondition`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly updateScoringCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.UpdateScoringCondition`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.UpdateOne,
    };

    static readonly getScoringCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetScoringCondition`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly deleteScoringCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.DeleteScoringCondition`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.DeleteOne,
    };

    static readonly export: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Export`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.GetOne,
    };

    static readonly importFromFile: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.ImportFromFile`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

    static readonly importFromJson: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.ImportFromJson`,
        Ownership   : ResourceOwnership.Tenant,
        ActionScope : ActionScope.Tenant,
        RequestType : RequestType.CreateOne,
    };

}
