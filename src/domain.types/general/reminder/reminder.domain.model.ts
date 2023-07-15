import { uuid } from "../../miscellaneous/system.types";
import { BaseSearchFilters, BaseSearchResults } from "../../miscellaneous/base.search.types";

export enum ReminderType {
    OneTime = 'OneTime',
    RepeatAfterEveryN = 'Repeat-After-Every-N',
    RepeatEveryWeekday = 'Repeat-Every-Weekday',
    RepeatEveryWeekOnDays = 'Repeat-Every-Week-On-Days',
    RepeatEveryMonthOn = 'Repeat-Every-Month-On',
    RepeatEveryQuarterOn = 'Repeat-Every-Quarter-On',
    RepeatEveryHour = 'Repeat-Every-Hour',
    RepeatEveryDay = 'Repeat-Every-Day',
    CustomFrequency = 'CustomFrequency',
}

export const ReminderTypeList: ReminderType [] = [
    ReminderType.OneTime,
    ReminderType.RepeatAfterEveryN,
    ReminderType.RepeatEveryWeekday,
    ReminderType.RepeatEveryWeekOnDays,
    ReminderType.RepeatEveryMonthOn,
    ReminderType.RepeatEveryQuarterOn,
    ReminderType.RepeatEveryHour,
    ReminderType.RepeatEveryDay,
    ReminderType.CustomFrequency,
];

export enum ReminderCustomFrequencyType {
    Hourly        = 'Hourly',
    Daily         = 'Daily',
    Weekly        = 'Weekly',
    Monthly       = 'Monthly',
    Yearly        = 'Yearly',
}

export const ReminderCustomFrequencyTypeList: ReminderCustomFrequencyType [] = [
    ReminderCustomFrequencyType.Hourly,
    ReminderCustomFrequencyType.Daily,
    ReminderCustomFrequencyType.Weekly,
    ReminderCustomFrequencyType.Monthly,
    ReminderCustomFrequencyType.Yearly,
];

export enum RepeatAfterEveryNUnit {
    Minute  = 'Minute',
    Hour    = 'Hour',
    Day     = 'Day',
    Week    = 'Week',
    Month   = 'Month',
    Quarter = 'Quarter',
    Year    = 'Year',
}

export const RepeatAfterEveryUnitList: RepeatAfterEveryNUnit [] = [
    RepeatAfterEveryNUnit.Minute,
    RepeatAfterEveryNUnit.Hour,
    RepeatAfterEveryNUnit.Day,
    RepeatAfterEveryNUnit.Week,
    RepeatAfterEveryNUnit.Month,
    RepeatAfterEveryNUnit.Quarter,
    RepeatAfterEveryNUnit.Year,
];

export interface ReminderDomainModel {
    id                   ?: uuid;
    UserId                : uuid;
    Name                  : string;
    ReminderType          : ReminderType;
    WhenDate             ?: string;
    WhenTime              : string;
    StartDate            ?: Date;
    EndDate              ?: Date;
    EndAfterNRepetitions ?: number;
    RepeatList           ?: string[];
    // CustomFrequencyType  ?: ReminderCustomFrequencyType;
    // FrequencyCount       ?: number;
    RepeatAfterEvery     ?: number;
    RepeatAfterEveryNUnit?: RepeatAfterEveryNUnit;
    HookUrl              ?: string;
}

export interface ReminderDto {
    id                    : uuid;
    UserId                : uuid;
    Name                  : string;
    ReminderType          : ReminderType;
    WhenDate             ?: string;
    WhenTime              : string;
    StartDate             : Date;
    EndDate              ?: Date;
    EndAfterNRepetitions ?: number;
    RepeatList           ?: string[];
    // CustomFrequencyType  ?: ReminderCustomFrequencyType;
    // FrequencyCount       ?: number;
    RepeatAfterEvery     ?: number;
    RepeatAfterEveryNUnit?: RepeatAfterEveryNUnit;
    HookUrl               : string;
    CreatedAt             : Date;
    UpdatedAt             : Date;
}

export interface ReminderSearchFilters extends BaseSearchFilters {
    UserId        ?: uuid;
    Name?          : string;
    ReminderType?  : string;
}

export interface ReminderSearchResults extends BaseSearchResults {
    Items : ReminderDto[];
}
