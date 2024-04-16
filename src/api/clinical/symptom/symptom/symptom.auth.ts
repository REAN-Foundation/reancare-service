import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomAuth {

  static _baseContext = `Clinical.Symptom`;

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
      Ownership   : ResourceOwnership.Tenant,
      ActionScope : ActionScope.Tenant,
      RequestType : RequestType.GetOne,
  };

  static search: AuthOptions = {
      ...DefaultAuthOptions,
      Context             : `${this._baseContext}.Search`,
      Ownership           : ResourceOwnership.Tenant,
      ActionScope         : ActionScope.Tenant,
      RequestType         : RequestType.Search,
      CustomAuthorization : true,
  };

}
