import { uuid } from "../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";

export enum ReminderType {
    OneTime = 'OneTime',
    Recurring = 'Recurring',
    Custom = 'Custom',
}

export enum FrequencyType {
    DoesNotRepeat = 'DoesNotRepeat',
    Hourly        = 'Hourly',
    Daily         = 'Daily',
    Weekly        = 'Weekly',
    AllWeekDays   = 'AllWeekDays',
    Monthly       = 'Monthly',
    Quarterly     = 'Quarterly',
    Yearly        = 'Yearly',
    Custom        = 'Custom',
}

export const ReminderTypeList: ReminderType [] = [
    ReminderType.OneTime,
    ReminderType.Recurring,
    ReminderType.Custom,
];

export const FrequencyTypeList: FrequencyType [] = [
    FrequencyType.DoesNotRepeat,
    FrequencyType.Hourly,
    FrequencyType.Daily,
    FrequencyType.Weekly,
    FrequencyType.AllWeekDays,
    FrequencyType.Monthly,
    FrequencyType.Quarterly,
    FrequencyType.Yearly,
    FrequencyType.Custom,
];

export interface ReminderDomainModel {
    id                   ?: string;
    UserId                : uuid;
    Name                  : string;
    ReminderType          : ReminderType;
    FrequencyType        ?: FrequencyType;
    FrequencyCount       ?: number;
    DateAndTime          ?: Date;
    StartDate            ?: Date;
    EndDate              ?: Date;
    EndAfterNRepetitions ?: number;
    RepeatList           ?: string[];
    HookUrl              ?: string;
}

export interface ReminderDto {
    id                   : string;
    UserId               : uuid;
    Name                 : string;
    ReminderType         : ReminderType;
    FrequencyType       ?: FrequencyType;
    FrequencyCount      ?: number;
    DateAndTime         ?: Date;
    StartDate            : Date;
    EndDate             ?: Date;
    EndAfterNRepetitions?: number;
    RepeatList          ?: string[];
    HookUrl              : string;
    CreatedAt            : Date;
    UpdatedAt            : Date;
}

export interface ReminderSearchFilters extends BaseSearchFilters {
    UserId        ?: uuid;
    Name?          : string;
    ReminderType?  : string;
    FrequencyType? : string;
}

export interface ReminderSearchResults extends BaseSearchResults {
    Items : ReminderDto[];
}
