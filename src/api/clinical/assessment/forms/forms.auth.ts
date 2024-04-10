import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class FormsAuth {

    static _baseContext = `Clinical.Assessments.Forms`;

    static connect: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.Connect`,
        Ownership  : ResourceOwnership.System,
        ActionScope: ActionScope.System,
        RequestType: RequestType.Custom,
    };

    static getFormsList: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.GetFormsList`,
        Ownership  : ResourceOwnership.System,
        ActionScope: ActionScope.System,
        RequestType: RequestType.Custom,
    };

    static importFormAsAssessmentTemplate: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.ImportFormAsAssessmentTemplate`,
        Ownership  : ResourceOwnership.System,
        ActionScope: ActionScope.System,
        RequestType: RequestType.Custom,
    };

    static importFormSubmissions: AuthOptions = {
        ...DefaultAuthOptions,
        Context    : `${this._baseContext}.ImportFormSubmissions`,
        Ownership  : ResourceOwnership.System,
        ActionScope: ActionScope.System,
        RequestType: RequestType.Custom,
    };
}