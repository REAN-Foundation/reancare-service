import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import {
    ReminderType,
    ReminderDomainModel,
    RepeatAfterEveryNUnit,
    MAX_END_AFTER_N_REPETITIONS,
    MAX_END_AFTER_QUARTERS,
    MAX_END_AFTER_MONTHS,
    MAX_END_AFTER_YEARS,
    MAX_END_AFTER_WEEKS,
    MAX_END_AFTER_DAYS
} from '../../../../../domain.types/general/reminder/reminder.domain.model';
import { IReminderScheduleRepo } from '../../../../repository.interfaces/general/reminder.schedule.repo.interface';
import Reminder from '../../models/general/reminder.model';
import ReminderSchedule from '../../models/general/reminder.schedule.model';
import User from '../../models/users/user/user.model';
import { MINUTES_IN_DAY, MINUTES_IN_HOUR, MINUTES_IN_MONTH, MINUTES_IN_QUARTER, MINUTES_IN_WEEK, MINUTES_IN_YEAR, TimeHelper } from '../../../../../common/time.helper';
import { DurationType } from '../../../../../domain.types/miscellaneous/time.types';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';
import dayjs from 'dayjs';

///////////////////////////////////////////////////////////////////////

export class ReminderScheduleRepo implements IReminderScheduleRepo {

    createSchedules = async (model: ReminderDomainModel): Promise<any[]> => {
        try {

            if (model.ReminderType === ReminderType.OneTime) {
                return await this.createOneTimeSchedule(model);
            } else if (model.ReminderType === ReminderType.RepeatAfterEveryN) {
                return await this.createRepeatAfterEveryNSchedules(model);
            } else if (model.ReminderType === ReminderType.RepeatEveryWeekday) {
                return await this.createRepeatEveryWeekdaySchedules(model);
            } else if (model.ReminderType === ReminderType.RepeatEveryWeekOnDays) {
                return await this.createRepeatEveryWeekOnDaysSchedules(model);
            } else if (model.ReminderType === ReminderType.RepeatEveryQuarterOn) {
                return await this.createRepeatEveryQuarterSchedules(model);
            } else if (model.ReminderType === ReminderType.RepeatEveryMonthOn) {
                return await this.createRepeatEveryMonthSchedules(model);
            } else if (model.ReminderType === ReminderType.RepeatEveryHour) {
                return await this.createRepeatEveryHourSchedules(model);
            } else if (model.ReminderType === ReminderType.RepeatEveryDay) {
                return await this.createRepeatEveryDaySchedules(model);
            }

            return [];

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getSchedulesForUser = async (userId: string, from: Date, to: Date): Promise<any[]> => {
        try {
            const schedules = await ReminderSchedule.findAll({
                where : {
                    UserId   : userId,
                    Schedule : {
                        [Op.between] : [from, to]
                    }
                },
                include : [
                    {
                        model    : Reminder,
                        as       : 'Reminder',
                        required : true,
                    }
                ]
            });
            return schedules;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteSchedulesForReminder = async (reminderId: string): Promise<boolean> => {
        try {
            const schedulesDeleted = await ReminderSchedule.destroy({
                where : {
                    ReminderId : reminderId,
                },
            });
            return schedulesDeleted > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteFutureSchedulesForReminder = async (reminderId: string): Promise<boolean> => {
        try {
            const schedulesDeleted = await ReminderSchedule.destroy({
                where : {
                    ReminderId : reminderId,
                    Schedule   : {
                        [Op.gte] : new Date(),
                    }
                },
            });
            return schedulesDeleted > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteAllSchedulesForUser = async (userId: string): Promise<boolean> => {
        try {
            const schedulesDeleted = await ReminderSchedule.destroy({
                where : {
                    UserId : userId,
                },
            });
            return schedulesDeleted > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<any> => {
        try {
            const schedule = await ReminderSchedule.findByPk(id);
            return schedule;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await ReminderSchedule.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    deleteRemindersForUser = async (userId: string): Promise<boolean> => {
        try {
            const deletedCount = await Reminder.destroy({
                where : {
                    UserId : userId
                }
            });
            return deletedCount > 0;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    createOneTimeSchedule = async (reminder: ReminderDomainModel): Promise<any[]> => {
        const userId = reminder.UserId;
        const offset = await this.getUserTimeZone(userId);

        const dateParts = reminder.WhenDate.split('-');
        const timeParts = reminder.WhenTime.split(':');
        const utcDate = Date.UTC(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2]),
            parseInt(timeParts[0]),
            parseInt(timeParts[1])
        );

        const scheduleDateTime = TimeHelper.subtractDuration(new Date(utcDate), offset, DurationType.Minute);

        const m = {
            UserId     : userId,
            ReminderId : reminder.id,
            Schedule   : scheduleDateTime,
        };

        const schedule = await ReminderSchedule.create(m);
        return [schedule];
    };

    createRepeatAfterEveryNSchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {
        const userId = reminder.UserId;
        const offset = await this.getUserTimeZone(userId);

        const dateParts = reminder.WhenDate.split('-');
        const timeParts = reminder.WhenTime.split(':');
        const utcDate = Date.UTC(
            parseInt(dateParts[0]),
            parseInt(dateParts[1]) - 1,
            parseInt(dateParts[2]),
            parseInt(timeParts[0]),
            parseInt(timeParts[1])
        );

        const referenceDate = TimeHelper.subtractDuration(new Date(utcDate), offset, DurationType.Minute);
        const { repeatEveryNUnit, repeatEveryN, endAfterRepeatations } =
            this.getRepeatations_afterEvery(reminder, referenceDate);
        const schedules = [];

        const durationType = repeatEveryNUnit as string;

        const arr = this.getIterableArray(endAfterRepeatations);
        for await (const i of arr) {
            const skipEvery = i * repeatEveryN;
            const schedule = await this.createRepeatAfterEverySchedule(
                referenceDate, skipEvery, userId, reminder.id, durationType as DurationType);
            schedules.push(schedule);
        }

        return schedules;
    };

    createRepeatEveryWeekdaySchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {
        const weekdayList = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        return await this.createWeeklySchedules(reminder, weekdayList);
    };

    createRepeatEveryWeekOnDaysSchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {
        const weekdayList = reminder.RepeatList;
        return await this.createWeeklySchedules(reminder, weekdayList);
    };

    createRepeatEveryQuarterSchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {

        const schedules = [];

        const userId = reminder.UserId;
        const offset = await this.getUserTimeZone(userId);
        const startDate = this.sanitizeStartForSchedules(reminder);
        const { hours, minutes, seconds } = this.getTimeParts(reminder);

        const endAfterNRepetitions = this.getRepeatations(
            reminder, startDate, MINUTES_IN_QUARTER, MAX_END_AFTER_QUARTERS);
        const arr = this.getIterableArray(endAfterNRepetitions);

        let referenceDate = TimeHelper.getStartOfDay(startDate, offset);
        referenceDate = this.addTimeToSchedule(referenceDate, hours, minutes, seconds);

        for await (const i of arr) {
            const quarter  = i * 3;
            const schedule = await this.createRepeatAfterEverySchedule(
                referenceDate, quarter, userId, reminder.id, DurationType.Month);
            if (schedule !== null) {
                schedules.push(schedule);
            }
        }
        return schedules;
    };

    createRepeatEveryMonthSchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {

        const schedules = [];
        const monthlyReminderList = reminder.RepeatList;
        const userId = reminder.UserId;
        const offset = await this.getUserTimeZone(userId);
        const startDate = this.sanitizeStartForSchedules(reminder);
        const { hours, minutes, seconds } = this.getTimeParts(reminder);

        const endAfterNRepetitions = this.getRepeatations(
            reminder, startDate, MINUTES_IN_MONTH, MAX_END_AFTER_MONTHS);
        const arr = this.getIterableArray(endAfterNRepetitions);

        if (!monthlyReminderList || monthlyReminderList.length < 1) {
            let referenceDate = TimeHelper.getStartOfDay(startDate, offset);
            referenceDate = this.addTimeToSchedule(referenceDate, hours, minutes, seconds);
            for await (const i of arr) {
                const month  = i;
                const schedule = await this.createRepeatAfterEverySchedule(
                    referenceDate, month, userId, reminder.id, DurationType.Month);
                if (schedule !== null) {
                    schedules.push(schedule);
                }
            }
        }
        else {
            const startDate = dayjs(reminder.StartDate);
            var count = 0;
            while (count < endAfterNRepetitions) {

                var year = startDate.year();
                var month = startDate.month();

                for await (const reminderOn of monthlyReminderList) {
                    const reminderOnParts = reminderOn.split('-');
                    const seq = reminderOnParts[0];
                    const weekday = reminderOnParts[1];
                    const dayForSchedule = this.getDayOfMonth(year, month, seq, weekday);
                    const referenceDate = TimeHelper.getStartOfDay(dayForSchedule.toDate(), offset);
                    var scheduleDateTime = this.addTimeToSchedule(referenceDate, hours, minutes, seconds);
                    if (scheduleDateTime < new Date()) {
                        continue;
                    }
                    const m = {
                        UserId     : userId,
                        ReminderId : reminder.id,
                        Schedule   : scheduleDateTime,
                    };
                    const schedule_ = await ReminderSchedule.create(m);
                    if (schedule_ !== null) {
                        schedules.push(schedule_);
                    }
                }
                month++;
                if (month > 11) {
                    month = 0;
                    year++;
                }
                count++;
            }
        }

        return schedules;
    };

    createRepeatEveryHourSchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {

        const schedules = [];
        const userId = reminder.UserId;
        const offset = await this.getUserTimeZone(userId);
        const startDate = this.sanitizeStartForSchedules(reminder);
        const { hours, minutes, seconds } = this.getTimeParts(reminder);

        const endAfterNRepetitions = this.getRepeatations(
            reminder, startDate, MINUTES_IN_HOUR, MAX_END_AFTER_N_REPETITIONS);
        const arr = this.getIterableArray(endAfterNRepetitions);

        let referenceDate = TimeHelper.getStartOfDay(startDate, offset);
        referenceDate = this.addTimeToSchedule(referenceDate, hours, minutes, seconds);
        for await (const i of arr) {
            const hour  = i;
            const schedule = await this.createRepeatAfterEverySchedule(
                referenceDate, hour, userId, reminder.id, DurationType.Hour);
            if (schedule !== null) {
                schedules.push(schedule);
            }
        }

        return schedules;
    };

    createRepeatEveryDaySchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {

        const schedules = [];
        const userId = reminder.UserId;
        const offset = await this.getUserTimeZone(userId);
        const startDate = this.sanitizeStartForSchedules(reminder);
        const { hours, minutes, seconds } = this.getTimeParts(reminder);

        const endAfterNRepetitions = this.getRepeatations(
            reminder, startDate, MINUTES_IN_DAY, MAX_END_AFTER_DAYS);
        const arr = this.getIterableArray(endAfterNRepetitions);

        let referenceDate = TimeHelper.getStartOfDay(startDate, offset);
        referenceDate = this.addTimeToSchedule(referenceDate, hours, minutes, seconds);
        for await (const i of arr) {
            const day  = i;
            const schedule = await this.createRepeatAfterEverySchedule(
                referenceDate, day, userId, reminder.id, DurationType.Day);
            if (schedule !== null) {
                schedules.push(schedule);
            }
        }

        return schedules;
    };

    private addTimeToSchedule(referenceDate: Date, hours: number, minutes: number, seconds: number) {
        referenceDate = TimeHelper.addDuration(referenceDate, hours, DurationType.Hour);
        referenceDate = TimeHelper.addDuration(referenceDate, minutes, DurationType.Minute);
        referenceDate = TimeHelper.addDuration(referenceDate, seconds, DurationType.Second);
        return referenceDate;
    }

    private sanitizeStartForSchedules(reminder: ReminderDomainModel) {
        let startDate = reminder.StartDate;
        if (!startDate) {
            startDate = new Date();
        }
        return startDate;
    }

    private getTimeParts(reminder: ReminderDomainModel) {
        const timeParts = reminder.WhenTime.split(':');
        const hours = parseInt(timeParts[0]);
        const minutes = parseInt(timeParts[1]);
        const seconds = timeParts.length > 2 ? parseInt(timeParts[2]) : 0;
        return { hours, minutes, seconds };
    }

    private getDayOfMonth(year: number, month: number, seq: string, weekday: string): dayjs.Dayjs {
        const firstDayOfMonth = dayjs()
            .year(year)
            .month(month)
            .date(1); //First day of the month

        const weekdayIndex = TimeHelper.getWeekdayIndex(weekday);
        const firstDayOfType = firstDayOfMonth.day(weekdayIndex);

        if (seq === 'First') {
            return firstDayOfType;
        }
        else if (seq === 'Second') {
            return firstDayOfType.add(1, 'week');
        }
        else if (seq === 'Third') {
            return firstDayOfType.add(2, 'week');
        }
        else if (seq === 'Last') {
            const lastDayOfMonth = firstDayOfMonth.endOf('month');
            const lastDayOfWeek = lastDayOfMonth.day(weekdayIndex);
            if (lastDayOfWeek.month() === month) {
                return lastDayOfWeek;
            }
            return lastDayOfWeek.subtract(1, 'week');
        }
    }

    private async createWeeklySchedules(reminder: ReminderDomainModel, weekdayList: string[]) {

        const schedules = [];
        const userId = reminder.UserId;
        const offset = await this.getUserTimeZone(userId);
        const startDate = this.sanitizeStartForSchedules(reminder);
        const { hours, minutes, seconds } = this.getTimeParts(reminder);

        const endAfterNRepetitions = this.getRepeatations(
            reminder, startDate, MINUTES_IN_WEEK, MAX_END_AFTER_WEEKS);
        const arr = this.getIterableArray(endAfterNRepetitions);

        for await (const day of weekdayList) {
            const startOfDay = TimeHelper.startOfDayThisWeekUtc(day);
            let referenceDate = TimeHelper.addDuration(new Date(startOfDay), -offset, DurationType.Minute);
            referenceDate = this.addTimeToSchedule(referenceDate, hours, minutes, seconds);
            for await (const i of arr) {
                const weekIndex = i;
                const schedule = await this.createRepeatAfterEverySchedule(
                    referenceDate, weekIndex, userId, reminder.id, DurationType.Week);
                schedules.push(schedule);
            }
        }

        return schedules;
    }

    private async createRepeatAfterEverySchedule(
        referenceDate: Date,
        repeatEveryN: number,
        userId: uuid,
        reminderId: uuid,
        durationType: DurationType) {
        const scheduleDateTime = TimeHelper.addDuration(referenceDate, repeatEveryN, durationType);
        if (scheduleDateTime < new Date()) {
            return null;
        }
        const m = {
            UserId     : userId,
            ReminderId : reminderId,
            Schedule   : scheduleDateTime,
        };
        const schedule = await ReminderSchedule.create(m);
        return schedule;
    }

    private getRepeatations_afterEvery(reminder: ReminderDomainModel, referenceDate: Date) {

        const repeatEveryN = reminder.RepeatAfterEvery;
        const repeatEveryNUnit = reminder.RepeatAfterEveryNUnit;
        const endDate = reminder.EndDate;
        let repetitions = 10;

        if (endDate !== null && endDate !== undefined) {

            const duration = TimeHelper.minuteDiff(endDate, referenceDate);

            if (repeatEveryNUnit === RepeatAfterEveryNUnit.Minute) {
                repetitions = Math.floor(duration / repeatEveryN);
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Hour) {
                repetitions = Math.floor(duration / (repeatEveryN * MINUTES_IN_HOUR));
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Day) {
                repetitions = Math.floor(duration / (repeatEveryN * MINUTES_IN_DAY));
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Week) {
                repetitions = Math.floor(duration / (repeatEveryN * MINUTES_IN_WEEK));
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Month) {
                repetitions = Math.floor(duration / (repeatEveryN * MINUTES_IN_MONTH));
                if (repetitions > MAX_END_AFTER_MONTHS) {
                    repetitions = MAX_END_AFTER_MONTHS;
                }
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Quarter) {
                repetitions = Math.floor(duration / (repeatEveryN * MINUTES_IN_QUARTER));
                if (repetitions > MAX_END_AFTER_QUARTERS) {
                    repetitions = MAX_END_AFTER_QUARTERS;
                }
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Year) {
                repetitions = Math.floor(duration / (repeatEveryN * MINUTES_IN_YEAR));
                if (repetitions > MAX_END_AFTER_YEARS) {
                    repetitions = MAX_END_AFTER_YEARS;
                }
            }
        }

        if (repetitions < 1) {
            repetitions = 1;
        }

        const endAfterRepeatations = Math.min(repetitions, MAX_END_AFTER_N_REPETITIONS);

        return { repeatEveryNUnit, repeatEveryN, endAfterRepeatations };
    }

    private getRepeatations(
        reminder: ReminderDomainModel,
        referenceDate: Date,
        durationMin: number,
        maxCount: number) {

        const endDate = reminder.EndDate;
        let repetitions = reminder.EndAfterNRepetitions;

        if (endDate !== null && endDate !== undefined) {
            const duration = TimeHelper.minuteDiff(endDate, referenceDate);
            repetitions = Math.floor(duration / durationMin);
        }
        if (repetitions < 1) {
            repetitions = 1;
        }
        repetitions = Math.min(repetitions, maxCount);
        return repetitions;
    }

    private async getUserTimeZone(userId: string) {
        const user = await User.findByPk(userId);
        if (user === null) {
            throw new ApiError(404, 'User not found.');
        }
        const timezone = user.CurrentTimeZone;
        const offset = TimeHelper.getTimezoneOffsets(timezone, DurationType.Minute);
        return offset;
    }

    private getIterableArray = (n: number): number[] => {
        const arr = [];
        for (var i = 0; i < n; i++) {
            arr.push(i);
        }
        return arr;
    }

}
