import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class DailyAssessmentAuth {

    static _baseContext = `Clinical.Assessments.DailyAssessment`;

    static create: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Create`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.CreateOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Search`,
        Ownership  : ResourceOwnership.Owner,
        ActionScope: ActionScope.Tenant,
        RequestType: RequestType.Search,
    };

}
