import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AssessmentTemplateAuth {

    static _baseContext = `Clinical.Assessments.AssessmentTemplate`;

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Create`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.CreateOne,
    };

    static update: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Update`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.UpdateOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Delete`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.DeleteOne,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetById`,
        Ownership  : ResourceOwnership.Tenant,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.GetOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.Search`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.Search,
        CustomAuthorization: true,
    };

    static addNode: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.AddNode`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,

    };

    static deleteNode: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.DeleteNode`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static searchNodes: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.SearchNode`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.Search,
        CustomAuthorization: true,
    };

    static getNode: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.GetNode`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.GetOne,
    };

    static updateNode: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.UpdateNode`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static setNextNodeToPath: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.SetNextNodeToPath`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static addPathCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.AddPathCondition`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static updatePathCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.UpdatePathCondition`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static getPathCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.GetPathCondition`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.GetOne,
    };

    static deletePathCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.DeletePathCondition`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static getPathConditionsForPath: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.GetConditionsForPath`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.GetMany,
    };

    static getNodePaths: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.GetNodePaths`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.GetMany,
    };

    static addPath: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.AddPath`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static deletePath: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.DeletePath`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.DeleteOne,
    };

    static updatePath: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.UpdatePath`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static getPath: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.GetPath`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.GetOne,
    };

    static addScoringCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.AddScoringCondition`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static updateScoringCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.UpdateScoringCondition`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.UpdateOne,
    };

    static getScoringCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.GetScoringCondition`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.GetOne,
    };

    static deleteScoringCondition: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.DeleteScoringCondition`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.DeleteOne,
    };

    static export: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.Export`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.GetOne,
    };

    static importFromFile: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.ImportFromFile`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.CreateOne,
    };

    static importFromJson: AuthOptions = {
        ...DefaultAuthOptions,
        Context            : `${this._baseContext}.ImportFromJson`,
        Ownership          : ResourceOwnership.Tenant,
        ActionScope        : ActionScope.Tenant,
        RequestType        : RequestType.CreateOne,
    };
    
}