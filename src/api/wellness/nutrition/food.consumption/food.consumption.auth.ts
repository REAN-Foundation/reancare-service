import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodConsumptionAuth {

static readonly _baseContext = `Wellness.Nutrition`;

static readonly create: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.Create`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static readonly update: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.Update`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.UpdateOne,
};

static readonly delete: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.Delete`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.DeleteOne,
};

static readonly getById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.GetById`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly getByEvent: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.GetByEvent`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly getForDay: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.GetForDay`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly getNutritionQuestionnaire: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Questionnaire.GetNutritionQuestionnaire`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static readonly search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.FoodConsumption.Search`,
    Ownership           : ResourceOwnership.System,
    ActionScope         : ActionScope.Public,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

}
