import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ClinicalTypeAuth {

    static _baseContext = `Clinical.ClinicalTypes`;

    static getClinicalValidationStatuses: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetClinicalValidationStatuses`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetMany,
    };

    static getInterpretations: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetInterpretations`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

    static getSeverities: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetSeverities`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.Public,
        RequestType : RequestType.GetOne,
    };

}
