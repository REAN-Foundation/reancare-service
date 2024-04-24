import {
    AuthOptions,
    RequestType,
    ResourceOwnership,
    ActionScope,
    DefaultAuthOptions
} from '../../../auth/auth.types';

///////////////////////////////////////////////////////////////////////////////////////

export class ReminderAuth {

    static readonly _baseContext = 'General.Reminder';

    static readonly createOneTimeReminder: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateOneTimeReminder`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly createReminderWithRepeatAfterEveryN: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatAfterEveryN`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly createReminderWithRepeatEveryWeekday: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatEveryWeekday`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly createReminderWithRepeatEveryWeekOnDays: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatEveryWeekOnDays`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly createReminderWithEveryMonthOn: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithEveryMonthOn`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly createReminderWithEveryQuarterOn: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithEveryQuarterOn`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly createReminderWithRepeatEveryHour: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatEveryHour`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly createReminderWithRepeatEveryDay: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.CreateReminderWithRepeatEveryDay`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.CreateOne,
    };

    static readonly search: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Search`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.Search,
    };

    static readonly getById: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.GetById`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.GetOne,
    };

    static readonly delete: AuthOptions = {
        ...DefaultAuthOptions,
        Context     : `${this._baseContext}.Delete`,
        Ownership   : ResourceOwnership.Owner,
        ActionScope : ActionScope.Owner,
        RequestType : RequestType.DeleteOne,
    };

}
