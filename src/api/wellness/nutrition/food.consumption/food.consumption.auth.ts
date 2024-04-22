import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class FoodConsumptionAuth {

static _baseContext = `Wellness.Nutrition`;

static create: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.Create`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.CreateOne,
};

static update: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.Update`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.UpdateOne,
};

static delete: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.Delete`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Owner,
    RequestType : RequestType.DeleteOne,
};

static getById: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.GetById`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static getByEvent: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.GetByEvent`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static getForDay: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.FoodConsumption.GetForDay`,
    Ownership   : ResourceOwnership.Owner,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static getNutritionQuestionnaire: AuthOptions = {
    ...DefaultAuthOptions,
    Context     : `${this._baseContext}.Questionnaire.GetNutritionQuestionnaire`,
    Ownership   : ResourceOwnership.System,
    ActionScope : ActionScope.Tenant,
    RequestType : RequestType.GetOne,
};

static search: AuthOptions = {
    ...DefaultAuthOptions,
    Context             : `${this._baseContext}.FoodConsumption.Search`,
    Ownership           : ResourceOwnership.System,
    ActionScope         : ActionScope.Public,
    RequestType         : RequestType.Search,
    CustomAuthorization : true,
};

}
