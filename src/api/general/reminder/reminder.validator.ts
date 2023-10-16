import express from 'express';
import {
    DEFAULT_END_AFTER_N_REPETITIONS,
    MAX_END_AFTER_N_REPETITIONS,
    MAX_END_AFTER_YEARS,
    MAX_REPEAT_AFTER_EVERY_N,
    NotificationType,
    ReminderDomainModel,
    ReminderSearchFilters,
    ReminderType,
} from '../../../domain.types/general/reminder/reminder.domain.model';
import { BaseValidator, Where } from '../../base.validator';
import { InputValidationError } from '../../../common/input.validation.error';
import { TimeHelper } from '../../../common/time.helper';
import { DurationType } from '../../../domain.types/miscellaneous/time.types';
import dayjs from 'dayjs';

///////////////////////////////////////////////////////////////////////////////////////

export class ReminderValidator extends BaseValidator {

    constructor() {
        super();
    }

    createOneTimeReminder = async (request: express.Request)
        : Promise<ReminderDomainModel> => {

        await this.validateString(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'WhenDate', Where.Body, true, false);
        await this.validateString(request, 'WhenTime', Where.Body, true, false);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);
        await this.validateString(request, 'NotificationType', Where.Body, true, false);
        await this.validateString(request, 'RawContent', Where.Body, false, false);

        await this.validateRequest(request);

        const requestBody = request.body;

        this.validateWhenDate(request);
        this.validateWhenTime(request);

        const createModel: ReminderDomainModel = {
            UserId           : requestBody.UserId ?? null,
            Name             : requestBody.Name ?? null,
            ReminderType     : ReminderType.OneTime,
            WhenDate         : requestBody.WhenDate ?? null,
            WhenTime         : requestBody.WhenTime ?? null,
            HookUrl          : requestBody.HookUrl ?? null,
            NotificationType : requestBody.NotificationType ?? NotificationType.SMS,
            RawContent       : requestBody.RawContent ?? null,
        };

        return createModel;
    };

    createReminderWithRepeatAfterEveryN = async (request: express.Request)
        : Promise<ReminderDomainModel> => {

        await this.validateString(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'WhenTime', Where.Body, true, false);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);
        await this.validateInt(request, 'RepeatAfterEvery', Where.Body, true, false);
        await this.validateString(request, 'RepeatAfterEveryNUnit', Where.Body, true, false);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        await this.validateInt(request, 'EndAfterNRepetitions', Where.Body, false, true);
        await this.validateString(request, 'NotificationType', Where.Body, true, false);
        await this.validateString(request, 'RawContent', Where.Body, false, false);

        await this.validateRequest(request);

        this.validateWhenDate(request);
        this.validateWhenTime(request);
        this.validateRepeatAfterEveryNUnit(request);
        this.validateRepeatAfterEveryN(request);
        this.validateFirstAndLastDate(request);
        this.validateEndAfterNRepetitions(request);

        const endDate = request.body.EndDate;
        const endAfterNRepetitions = request.body.EndAfterNRepetitions as number;
        if (endDate == null && endAfterNRepetitions == null) {
            request.body.EndAfterNRepetitions = DEFAULT_END_AFTER_N_REPETITIONS;
        }

        const requestBody = request.body;

        const startDate = requestBody.StartDate ?
            dayjs(requestBody.StartDate)
                .format()
                .split('T')[0]
            : null;

        const createModel: ReminderDomainModel = {
            UserId                : requestBody.UserId ?? null,
            Name                  : requestBody.Name ?? null,
            ReminderType          : ReminderType.RepeatAfterEveryN,
            WhenDate              : startDate ?? null, //WhenDate is start date for RepeatAfterEveryN
            WhenTime              : requestBody.WhenTime ?? null,
            HookUrl               : requestBody.HookUrl ?? null,
            RepeatAfterEvery      : requestBody.RepeatAfterEvery ?? null,
            RepeatAfterEveryNUnit : requestBody.RepeatAfterEveryNUnit ?? null,
            StartDate             : requestBody.StartDate ?? null,
            EndDate               : requestBody.EndDate ?? null,
            EndAfterNRepetitions  : requestBody.EndAfterNRepetitions ?? null,
            NotificationType      : requestBody.NotificationType ?? NotificationType.SMS,
            RawContent            : requestBody.RawContent ?? null,
        };

        return createModel;
    };

    createReminderWithRepeatEveryWeekday = async (request: express.Request)
        : Promise<ReminderDomainModel> => {

        await this.validateString(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'WhenTime', Where.Body, true, false);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        await this.validateInt(request, 'EndAfterNRepetitions', Where.Body, false, true);
        await this.validateString(request, 'NotificationType', Where.Body, true, false);
        await this.validateString(request, 'RawContent', Where.Body, false, false);

        await this.validateRequest(request);

        this.validateWhenTime(request);
        this.validateFirstAndLastDate(request);
        this.validateEndAfterNRepetitions(request);

        const endDate = request.body.EndDate;
        const endAfterNRepetitions = request.body.EndAfterNRepetitions as number;
        if (endDate == null && endAfterNRepetitions == null) {
            request.body.EndAfterNRepetitions = DEFAULT_END_AFTER_N_REPETITIONS;
        }

        const requestBody = request.body;

        const createModel: ReminderDomainModel = {
            UserId               : requestBody.UserId ?? null,
            Name                 : requestBody.Name ?? null,
            ReminderType         : ReminderType.RepeatEveryWeekday,
            WhenTime             : requestBody.WhenTime ?? null,
            HookUrl              : requestBody.HookUrl ?? null,
            RepeatList           : ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
            StartDate            : requestBody.StartDate ?? null,
            EndDate              : requestBody.EndDate ?? null,
            EndAfterNRepetitions : requestBody.EndAfterNRepetitions ?? null,
            NotificationType     : requestBody.NotificationType ?? NotificationType.SMS,
            RawContent           : requestBody.RawContent ?? null,
        };

        return createModel;
    };

    createReminderWithRepeatEveryWeekOnDays = async (request: express.Request)
        : Promise<ReminderDomainModel> => {

        await this.validateString(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'WhenTime', Where.Body, true, false);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);
        await this.validateArray(request, 'RepeatList', Where.Body, true, false);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        await this.validateInt(request, 'EndAfterNRepetitions', Where.Body, false, true);
        await this.validateString(request, 'NotificationType', Where.Body, true, false);
        await this.validateString(request, 'RawContent', Where.Body, false, false);

        await this.validateRequest(request);

        this.validateWhenTime(request);
        this.validateFirstAndLastDate(request);
        this.validateWeekdayList(request);
        this.validateEndAfterNRepetitions(request);

        const endDate = request.body.EndDate;
        const endAfterNRepetitions = request.body.EndAfterNRepetitions as number;
        if (endDate == null && endAfterNRepetitions == null) {
            request.body.EndAfterNRepetitions = DEFAULT_END_AFTER_N_REPETITIONS;
        }

        const requestBody = request.body;

        const createModel: ReminderDomainModel = {
            UserId               : requestBody.UserId ?? null,
            Name                 : requestBody.Name ?? null,
            ReminderType         : ReminderType.RepeatEveryWeekOnDays,
            WhenTime             : requestBody.WhenTime ?? null,
            HookUrl              : requestBody.HookUrl ?? null,
            RepeatList           : requestBody.RepeatList ?? ['Monday'],
            StartDate            : requestBody.StartDate ?? null,
            EndDate              : requestBody.EndDate ?? null,
            EndAfterNRepetitions : requestBody.EndAfterNRepetitions ?? null,
            NotificationType     : requestBody.NotificationType ?? NotificationType.SMS,
            RawContent           : requestBody.RawContent ?? null,
        };

        return createModel;
    };

    createReminderWithEveryMonthOn = async (request: express.Request)
        : Promise<ReminderDomainModel> => {

        await this.validateString(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'WhenTime', Where.Body, true, false);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);
        await this.validateArray(request, 'RepeatList', Where.Body, false, false);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        await this.validateInt(request, 'EndAfterNRepetitions', Where.Body, false, true);
        await this.validateString(request, 'NotificationType', Where.Body, true, false);
        await this.validateString(request, 'RawContent', Where.Body, false, false);

        await this.validateRequest(request);

        this.validateWhenTime(request);
        this.validateFirstAndLastDate(request);
        this.validateMonthlyReminderList(request);
        this.validateEndAfterNRepetitions(request);

        const endDate = request.body.EndDate;
        const endAfterNRepetitions = request.body.EndAfterNRepetitions as number;
        if (endDate == null && endAfterNRepetitions == null) {
            request.body.EndAfterNRepetitions = DEFAULT_END_AFTER_N_REPETITIONS;
        }

        const requestBody = request.body;

        const createModel: ReminderDomainModel = {
            UserId               : requestBody.UserId ?? null,
            Name                 : requestBody.Name ?? null,
            ReminderType         : ReminderType.RepeatEveryMonthOn,
            WhenTime             : requestBody.WhenTime ?? null,
            HookUrl              : requestBody.HookUrl ?? null,
            RepeatList           : requestBody.RepeatList ?? [],
            StartDate            : requestBody.StartDate ?? null,
            EndDate              : requestBody.EndDate ?? null,
            EndAfterNRepetitions : requestBody.EndAfterNRepetitions ?? null,
            NotificationType     : requestBody.NotificationType ?? NotificationType.SMS,
            RawContent           : requestBody.RawContent ?? null,
        };

        return createModel;
    };

    createReminderWithEveryQuarterOn = async (request: express.Request)
        : Promise<ReminderDomainModel> => {

        await this.validateString(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'WhenTime', Where.Body, true, false);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        await this.validateInt(request, 'EndAfterNRepetitions', Where.Body, false, true);
        await this.validateString(request, 'NotificationType', Where.Body, true, false);
        await this.validateString(request, 'RawContent', Where.Body, false, false);

        await this.validateRequest(request);

        this.validateWhenTime(request);
        this.validateFirstAndLastDate(request);
        this.validateEndAfterNRepetitions(request);

        const endDate = request.body.EndDate;
        const endAfterNRepetitions = request.body.EndAfterNRepetitions as number;
        if (endDate == null && endAfterNRepetitions == null) {
            request.body.EndAfterNRepetitions = DEFAULT_END_AFTER_N_REPETITIONS;
        }

        const requestBody = request.body;

        const createModel: ReminderDomainModel = {
            UserId               : requestBody.UserId ?? null,
            Name                 : requestBody.Name ?? null,
            ReminderType         : ReminderType.RepeatEveryQuarterOn,
            WhenTime             : requestBody.WhenTime ?? null,
            HookUrl              : requestBody.HookUrl ?? null,
            RepeatList           : requestBody.RepeatList ?? ['Start'],
            StartDate            : requestBody.StartDate ?? null,
            EndDate              : requestBody.EndDate ?? null,
            EndAfterNRepetitions : requestBody.EndAfterNRepetitions ?? null,
            NotificationType     : requestBody.NotificationType ?? NotificationType.SMS,
            RawContent           : requestBody.RawContent ?? null,
        };

        return createModel;
    };

    createReminderWithRepeatEveryHour = async (request: express.Request)
        : Promise<ReminderDomainModel> => {

        await this.validateString(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'WhenTime', Where.Body, true, false);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        await this.validateInt(request, 'EndAfterNRepetitions', Where.Body, false, true);
        await this.validateString(request, 'NotificationType', Where.Body, true, false);
        await this.validateString(request, 'RawContent', Where.Body, false, false);

        await this.validateRequest(request);

        this.validateWhenTime(request);
        this.validateFirstAndLastDate(request);
        this.validateEndAfterNRepetitions(request);

        const endDate = request.body.EndDate;
        const endAfterNRepetitions = request.body.EndAfterNRepetitions as number;
        if (endDate == null && endAfterNRepetitions == null) {
            request.body.EndAfterNRepetitions = DEFAULT_END_AFTER_N_REPETITIONS;
        }

        const requestBody = request.body;

        const createModel: ReminderDomainModel = {
            UserId               : requestBody.UserId ?? null,
            Name                 : requestBody.Name ?? null,
            ReminderType         : ReminderType.RepeatEveryHour,
            WhenTime             : requestBody.WhenTime ?? null,
            HookUrl              : requestBody.HookUrl ?? null,
            NotificationType     : requestBody.NotificationType ?? NotificationType.SMS,
            RepeatList           : requestBody.RepeatList ?? ['Start'],
            StartDate            : requestBody.StartDate ?? null,
            EndDate              : requestBody.EndDate ?? null,
            EndAfterNRepetitions : requestBody.EndAfterNRepetitions ?? null,
            RawContent           : requestBody.RawContent ?? null,
        };

        return createModel;
    };

    createReminderWithRepeatEveryDay = async (request: express.Request)
        : Promise<ReminderDomainModel> => {

        await this.validateString(request, 'UserId', Where.Body, true, false);
        await this.validateString(request, 'Name', Where.Body, true, false);
        await this.validateString(request, 'WhenTime', Where.Body, true, false);
        await this.validateString(request, 'HookUrl', Where.Body, false, true);
        await this.validateDate(request, 'StartDate', Where.Body, false, true);
        await this.validateDate(request, 'EndDate', Where.Body, false, true);
        await this.validateInt(request, 'EndAfterNRepetitions', Where.Body, false, true);
        await this.validateString(request, 'NotificationType', Where.Body, true, false);
        await this.validateString(request, 'RawContent', Where.Body, false, false);

        await this.validateRequest(request);

        this.validateWhenTime(request);
        this.validateFirstAndLastDate(request);
        this.validateEndAfterNRepetitions(request);

        const endDate = request.body.EndDate;
        const endAfterNRepetitions = request.body.EndAfterNRepetitions as number;
        if (endDate == null && endAfterNRepetitions == null) {
            request.body.EndAfterNRepetitions = DEFAULT_END_AFTER_N_REPETITIONS;
        }

        const requestBody = request.body;

        const createModel: ReminderDomainModel = {
            UserId               : requestBody.UserId ?? null,
            Name                 : requestBody.Name ?? null,
            ReminderType         : ReminderType.RepeatEveryDay,
            WhenTime             : requestBody.WhenTime ?? null,
            HookUrl              : requestBody.HookUrl ?? null,
            RepeatList           : requestBody.RepeatList ?? ['Start'],
            StartDate            : requestBody.StartDate ?? null,
            EndDate              : requestBody.EndDate ?? null,
            EndAfterNRepetitions : requestBody.EndAfterNRepetitions ?? null,
            NotificationType     : requestBody.NotificationType ?? NotificationType.SMS,
            RawContent           : requestBody.RawContent ?? null,
        };

        return createModel;
    };

    search = async (request: express.Request): Promise<ReminderSearchFilters> => {

        await this.validateUuid(request, 'userId', Where.Query, false, false);
        await this.validateString(request, 'name', Where.Query, false, false);
        await this.validateString(request, 'reminderType', Where.Query, false, false);
        await this.validateString(request, 'notificationType', Where.Query, false, false);
        await this.validateString(request, 'whenDate', Where.Query, false, false);
        await this.validateString(request, 'whenTime', Where.Query, false, false);
        await this.validateBaseSearchFilters(request);

        this.validateRequest(request);

        return this.getFilter(request);
    };

    //#region Privates

    private validateWhenTime = (request: express.Request): void => {
        const whenTime = request.body.WhenTime as string;
        if (whenTime == null) {
            throw new InputValidationError(["Invalid When-Time value!"]);
        }
        const whenTimeParts = whenTime.split(':');
        if (whenTimeParts.length < 2) {
            throw new InputValidationError(["Invalid When-Time value!"]);
        }
        const hour = parseInt(whenTimeParts[0]);
        const minute = parseInt(whenTimeParts[1]);
        if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
            throw new InputValidationError(["Invalid When-Time value!"]);
        }
        if (whenTimeParts.length === 2) {
            request.body.WhenTime = whenTime + ':00';
        }
    };

    private validateWhenDate = (request: express.Request): void => {
        const whenDate = dayjs(request.body.WhenDate).format();
        if (whenDate == null) {
            throw new InputValidationError(["Invalid When-Date value!"]);
        }
        const dateParts = whenDate.split('T');
        const whenDateParts = dateParts[0].split('-');
        if (whenDateParts.length < 3) {
            throw new InputValidationError(["Invalid When-Date value!"]);
        }
        const year = parseInt(whenDateParts[0]);
        const month = parseInt(whenDateParts[1]);
        const day = parseInt(whenDateParts[2]);
        if (year < 1900 || year > 2100 || month < 1 || month > 12 || day < 1 || day > 31) {
            throw new InputValidationError(["Invalid When-Date value!"]);
        }

        const date = new Date(whenDate);
        if (date == null || date.toString() === 'Invalid Date') {
            throw new InputValidationError(["Invalid When-Date value!"]);
        }
        const dt = TimeHelper.subtractDuration(new Date(), 1, DurationType.Day);
        if (dt > date) {
            throw new InputValidationError(["When-Date cannot be in the past!"]);
        }
    };

    private validateRepeatAfterEveryNUnit = (request: express.Request): void => {
        const repeatEveryNUnit = request.body.RepeatAfterEveryNUnit as string;
        if (repeatEveryNUnit == null) {
            throw new InputValidationError(["Invalid Repeat-Every-N-Unit value!"]);
        }
        if (repeatEveryNUnit !== 'Minute' && repeatEveryNUnit !== 'Hour' && repeatEveryNUnit !== 'Day' &&
            repeatEveryNUnit !== 'Week' && repeatEveryNUnit !== 'Month' && repeatEveryNUnit !== 'Quarter' &&
            repeatEveryNUnit !== 'Year') {
            throw new InputValidationError(["Invalid Repeat-Every-N-Unit value!"]);
        }
    };

    private validateRepeatAfterEveryN = (request: express.Request): void => {
        const repeatEveryN = request.body.RepeatAfterEvery as number;
        if (repeatEveryN == null) {
            throw new InputValidationError(["Invalid Repeat-Every-N value!"]);
        }
        if (repeatEveryN < 1 || repeatEveryN > MAX_REPEAT_AFTER_EVERY_N) {
            throw new InputValidationError(["Invalid Repeat-Every-N value!"]);
        }
    };

    private validateEndAfterNRepetitions = (request: express.Request): void => {
        const endAfterNRepetitions = request.body.EndAfterNRepetitions as number;
        if (endAfterNRepetitions != null) {
            if (endAfterNRepetitions < 1 || endAfterNRepetitions > MAX_END_AFTER_N_REPETITIONS) {
                throw new InputValidationError(["Invalid End-After-N-Repetitions value!"]);
            }
        }
    };

    private validateFirstAndLastDate = (request: express.Request): void => {
        const startDate = request.body.StartDate as Date;
        const endDate = request.body.EndDate as Date;
        this.validateStartandEnd(startDate, endDate);
    };

    private validateWeekdayList = (request: express.Request): void => {
        const weekdayList = request.body.RepeatList as string[];
        if (weekdayList == null || weekdayList.length < 1) {
            throw new InputValidationError(['Invalid weekday list!']);
        }
        for (const day of weekdayList) {
            if (day !== 'Sunday' && day !== 'Monday' && day !== 'Tuesday' && day !== 'Wednesday' &&
                day !== 'Thursday' && day !== 'Friday' && day !== 'Saturday') {
                throw new InputValidationError(['Invalid weekday list!']);
            }
        }
    };

    private validateMonthlyReminderList = (request: express.Request): void => {

        const monthlyReminderList = request.body.RepeatList as string[];

        if (monthlyReminderList != null && monthlyReminderList.length > 0) {
            for (const reminderOn of monthlyReminderList) {
                const reminderOnParts = reminderOn.split('-');
                if (reminderOnParts.length < 2) {
                    throw new InputValidationError(['Invalid monthly reminder list!']);
                }
                const seq = reminderOnParts[0];
                if (seq !== 'First' && seq !== 'Second' && seq !== 'Third' && seq !== 'Fourth' && seq !== 'Last') {
                    throw new InputValidationError(['Invalid monthly reminder list!']);
                }
                const weekday = reminderOnParts[1];
                if (weekday !== 'Sunday' && weekday !== 'Monday' && weekday !== 'Tuesday' && weekday !== 'Wednesday' &&
                weekday !== 'Thursday' && weekday !== 'Friday' && weekday !== 'Saturday') {
                    throw new InputValidationError(['Invalid monthly reminder list!']);
                }
            }
        }
    };

    private validateStartandEnd(startDate: Date, endDate: Date) {
        if (endDate != null) {
            if (endDate < new Date()) {
                throw new InputValidationError(['End date cannot be in the past!']);
            }
            if (endDate < startDate) {
                throw new InputValidationError(['End date cannot be before start date!']);
            }
            if (endDate > new Date(new Date().setFullYear(new Date().getFullYear() + MAX_END_AFTER_YEARS))) {
                throw new InputValidationError(['End date cannot be more than 1 year from now!']);
            }
        }
        if (startDate != null) {
            //Don't allow start date to be in the past more than 2 minutes
            if (startDate < TimeHelper.subtractDuration(new Date(), 1, DurationType.Day)) {
                throw new InputValidationError(['Start date cannot be in the past!']);
            }
        }
    }

    private getFilter(request): ReminderSearchFilters {

        const filters: ReminderSearchFilters = {
            UserId           : request.query.userId ?? null,
            Name             : request.query.name ?? null,
            ReminderType     : request.query.reminderType ?? null,
            NotificationType : request.query.notificationType ?? null,
            WhenDate         : request.query.whenDate ?? null,
            WhenTime         : request.query.whenTime ?? null
        };

        return this.updateBaseSearchFilters(request, filters);
    }

    //#endregion

}
