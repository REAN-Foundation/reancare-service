import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import {
    ReminderType,
    ReminderDomainModel,
    RepeatAfterEveryNUnit
} from '../../../../../domain.types/general/reminder/reminder.domain.model';
import { IReminderScheduleRepo } from '../../../../repository.interfaces/general/reminder.schedule.repo.interface';
import Reminder from '../../models/general/reminder.model';
import ReminderSchedule from '../../models/general/reminder.schedule.model';
import User from '../../models/users/user/user.model';
import { TimeHelper } from '../../../../../common/time.helper';
import { DurationType } from '../../../../../domain.types/miscellaneous/time.types';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';

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
        const { repeatEveryNUnit, repeatEveryN, endAfterRepeatations } = this.getRepeatations(reminder, referenceDate);
        const schedules = [];

        const durationType = repeatEveryNUnit as string;
        for (let i = 0; i < endAfterRepeatations; i++) {
            const schedule = await this.createRepeatAfterEverySchedule(
                referenceDate, repeatEveryN, userId, reminder.id, durationType as DurationType);
            schedules.push(schedule);
        }

        return schedules;
    };

    createRepeatEveryWeekdaySchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {
        // const userId = reminder.UserId;
        // const offset = await this.getUserTimeZone(userId);

        // const dateParts = reminder.WhenDate.split('-');
        // const timeParts = reminder.WhenTime.split(':');

        // const utcDate = Date.UTC(
        //     parseInt(dateParts[0]),
        //     parseInt(dateParts[1]) - 1,
        //     parseInt(dateParts[2]),
        //     parseInt(timeParts[0]),
        //     parseInt(timeParts[1])
        // );
        Logger.instance().log(JSON.stringify(reminder));
        throw new Error('Method not implemented.');
    };

    createRepeatEveryWeekOnDaysSchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {
        Logger.instance().log(JSON.stringify(reminder));
        throw new Error('Method not implemented.');
    };

    createRepeatEveryQuarterSchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {
        Logger.instance().log(JSON.stringify(reminder));
        throw new Error('Method not implemented.');
    };

    createRepeatEveryMonthSchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {
        Logger.instance().log(JSON.stringify(reminder));
        throw new Error('Method not implemented.');
    };

    createRepeatEveryHourSchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {
        Logger.instance().log(JSON.stringify(reminder));
        throw new Error('Method not implemented.');
    };

    createRepeatEveryDaySchedules = async (reminder: ReminderDomainModel): Promise<any[]> => {
        Logger.instance().log(JSON.stringify(reminder));
        throw new Error('Method not implemented.');
    };
    
    private async createRepeatAfterEverySchedule(
        referenceDate: Date,
        repeatEveryN: number,
        userId: uuid,
        reminderId: uuid,
        durationType: DurationType) {
        const scheduleDateTime = TimeHelper.addDuration(referenceDate, repeatEveryN, durationType);
        const m = {
            UserId     : userId,
            ReminderId : reminderId,
            Schedule   : scheduleDateTime,
        };
        const schedule = await ReminderSchedule.create(m);
        return schedule;
    }

    private getRepeatations(reminder: ReminderDomainModel, referenceDate: Date) {
        const repeatEveryN = reminder.RepeatAfterEvery;
        const repeatEveryNUnit = reminder.RepeatAfterEveryNUnit;
        const endDate = reminder.EndDate;
        let endAfterRepeatations = reminder.EndAfterNRepetitions;
        if (endDate !== null && endDate !== undefined) {
            const duration = TimeHelper.minuteDiff(endDate, referenceDate);
            if (repeatEveryNUnit === RepeatAfterEveryNUnit.Minute) {
                endAfterRepeatations = Math.floor(duration / repeatEveryN);
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Hour) {
                endAfterRepeatations = Math.floor(duration / (repeatEveryN * 60));
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Day) {
                endAfterRepeatations = Math.floor(duration / (repeatEveryN * 60 * 24));
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Week) {
                endAfterRepeatations = Math.floor(duration / (repeatEveryN * 60 * 24 * 7));
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Month) {
                endAfterRepeatations = Math.floor(duration / (repeatEveryN * 60 * 24 * 30));
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Quarter) {
                endAfterRepeatations = Math.floor(duration / (repeatEveryN * 60 * 24 * 30 * 3));
            }
            else if (repeatEveryNUnit === RepeatAfterEveryNUnit.Year) {
                endAfterRepeatations = Math.floor(duration / (repeatEveryN * 60 * 24 * 365));
            }
            else {
                endAfterRepeatations = endAfterRepeatations ?? 10;
            }
        }
        return { repeatEveryNUnit, repeatEveryN, endAfterRepeatations };
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

}
