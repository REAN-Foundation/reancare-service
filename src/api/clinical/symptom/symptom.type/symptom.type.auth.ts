import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class SymptomTypeAuth {

  static _baseContext = `Clinical.SymptomType`;

  static create: AuthOptions = {
      ...DefaultAuthOptions,
      Context     : `${this._baseContext}.Create`,
      Ownership   : ResourceOwnership.Tenant,
      ActionScope : ActionScope.Tenant,
      RequestType : RequestType.CreateOne,
  };

  static update: AuthOptions = {
      ...DefaultAuthOptions,
      Context     : `${this._baseContext}.Update`,
      Ownership   : ResourceOwnership.Tenant,
      ActionScope : ActionScope.Tenant,
      RequestType : RequestType.UpdateOne,
  };

  static delete: AuthOptions = {
      ...DefaultAuthOptions,
      Context     : `${this._baseContext}.Delete`,
      Ownership   : ResourceOwnership.Tenant,
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
