import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import {
    ReminderType,
    ReminderDomainModel,
    ReminderDto,
    RepeatAfterEveryNUnit }
    from '../../../../../domain.types/general/reminder/reminder.domain.model';
import { IReminderScheduleRepo } from '../../../../repository.interfaces/general/reminder.schedule.repo.interface';
import { ReminderMapper } from '../../mappers/general/reminder.mapper';
import Reminder from '../../models/general/reminder.model';
import ReminderSchedule from '../../models/general/reminder.schedule.model';

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

    create = async (model: ReminderDomainModel): Promise<ReminderDto> => {
        try {
            const entity = {
                Name                  : model.Name,
                UserId                : model.UserId,
                ReminderType          : model.ReminderType ?? ReminderType.OneTime,
                WhenDate              : model.WhenDate ?? null,
                WhenTime              : model.WhenTime ?? null,
                StartDate             : model.StartDate ?? new Date(),
                EndDate               : model.EndDate ?? null,
                EndAfterNRepetitions  : model.EndAfterNRepetitions ?? 10,
                RepeatList            : model.RepeatList ? JSON.stringify(model.RepeatList) : '[]',
                RepeatAfterEvery      : model.RepeatAfterEvery ?? 1,
                RepeatAfterEveryNUnit : model.RepeatAfterEveryNUnit ?? RepeatAfterEveryNUnit,
                HookUrl               : model.HookUrl ?? null,
            };
            const reminder = await Reminder.create(entity);
            const dto = await ReminderMapper.toDto(reminder);
            return dto;
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

    createOneTimeSchedule = async (model: ReminderDomainModel): Promise<any[]> => {
        throw new Error('Method not implemented.');
    };
    
    createRepeatAfterEveryNSchedules = async (model: ReminderDomainModel): Promise<any[]> => {
        throw new Error('Method not implemented.');
    };

    createRepeatEveryWeekdaySchedules = async (model: ReminderDomainModel): Promise<any[]> => {
        throw new Error('Method not implemented.');
    };

    createRepeatEveryWeekOnDaysSchedules = async (model: ReminderDomainModel): Promise<any[]> => {
        throw new Error('Method not implemented.');
    };

    createRepeatEveryQuarterSchedules = async (model: ReminderDomainModel): Promise<any[]> => {
        throw new Error('Method not implemented.');
    };

    createRepeatEveryMonthSchedules = async (model: ReminderDomainModel): Promise<any[]> => {
        throw new Error('Method not implemented.');
    };

    createRepeatEveryHourSchedules = async (model: ReminderDomainModel): Promise<any[]> => {
        throw new Error('Method not implemented.');
    };

    createRepeatEveryDaySchedules = async (model: ReminderDomainModel): Promise<any[]> => {
        throw new Error('Method not implemented.');
    };
    
}
