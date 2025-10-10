import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class AhaNumbersAuth {

    static readonly _baseContext = 'Statistics.AhaNumbers';

    static readonly upload: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Upload`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

    static readonly download: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Download`,
        Ownership   : ResourceOwnership.System,
        ActionScope : ActionScope.System,
        RequestType : RequestType.GetMany,
    };

}
