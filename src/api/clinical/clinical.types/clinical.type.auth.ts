import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ClinicalTypeAuth {

    static readonly _baseContext = `Clinical.ClinicalTypes`;

    static readonly getClinicalValidationStatuses: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetClinicalValidationStatuses`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly getInterpretations: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetInterpretations`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static readonly getSeverities: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetSeverities`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

}
