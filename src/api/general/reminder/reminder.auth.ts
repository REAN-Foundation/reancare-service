import { 
    AuthOptions, 
    RequestType, 
    ResourceOwnership, 
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ReminderAuth {

    static _baseContext = 'General.Reminder';

    static createOneTimeReminder: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateOneTimeReminder`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static createReminderWithRepeatAfterEveryN: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatAfterEveryN`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static createReminderWithRepeatEveryWeekday: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatEveryWeekday`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static createReminderWithRepeatEveryWeekOnDays: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatEveryWeekOnDays`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static createReminderWithEveryMonthOn: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithEveryMonthOn`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static createReminderWithEveryQuarterOn: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithEveryQuarterOn`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static createReminderWithRepeatEveryHour: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatEveryHour`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static createReminderWithRepeatEveryDay: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatEveryDay`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.Search,
    };

    static getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.DeleteOne,
    };

}
