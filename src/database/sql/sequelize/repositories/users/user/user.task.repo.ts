/* eslint-disable max-len */
import { Op } from 'sequelize';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { TimeHelper } from '../../../../../../common/time.helper';
import { ProgressStatus, uuid } from '../../../../../../domain.types/miscellaneous/system.types';
import { DurationType } from '../../../../../../domain.types/miscellaneous/time.types';
import { UserTaskCategory } from '../../../../../../domain.types/users/user.task/user.task.types';
import { UserTaskDomainModel } from '../../../../../../domain.types/users/user.task/user.task.domain.model';
import { TaskSummaryDto, UserTaskDto } from '../../../../../../domain.types/users/user.task/user.task.dto';
import { UserTaskSearchFilters, UserTaskSearchResults } from '../../../../../../domain.types/users/user.task/user.task.search.types';
import { IUserTaskRepo } from '../../../../../repository.interfaces/users/user/user.task.repo.interface';
import { UserTaskMapper } from '../../../mappers/users/user/user.task.mapper';
import User from '../../../models/users/user/user.model';
import UserTask from '../../../models/users/user/user.task.model';
import { HelperRepo } from '../../common/helper.repo';

///////////////////////////////////////////////////////////////////////

export class UserTaskRepo implements IUserTaskRepo {

    create = async (model: UserTaskDomainModel): Promise<UserTaskDto> => {
        try {
            const entity = {
                DisplayId          : model.DisplayId ?? null,
                UserId             : model.UserId ?? null,
                Task               : model.Task ?? null,
                Category           : model.Category ?? null,
                ActionType         : model.ActionType ?? null,
                ActionId           : model.ActionId ?? null,
                ScheduledStartTime : model.ScheduledStartTime ?? null,
                ScheduledEndTime   : model.ScheduledEndTime ?? null,
            };
            const userTask = await UserTask.create(entity);
            return UserTaskMapper.toDto(userTask);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<UserTaskDto> => {
        try {
            const userTask = await UserTask.findByPk(id);
            return UserTaskMapper.toDto(userTask);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByActionId = async (actionId: string): Promise<UserTaskDto> => {
        try {
            const userTask = await UserTask.findOne({
                where : {
                    ActionId : actionId
                }
            });
            return UserTaskMapper.toDto(userTask);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByDisplayId = async (displayId: string): Promise<UserTaskDto> => {
        try {
            const userTask = await UserTask.findOne({
                where : {
                    DisplayId : displayId
                }
            });
            return UserTaskMapper.toDto(userTask);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: UserTaskSearchFilters): Promise<UserTaskSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.UserId != null) {
                search.where['UserId'] = filters.UserId;
            }
            if (filters.ActionId != null) {
                search.where['ReferenceItemId'] = filters.ActionId;
            }
            if (filters.Task != null) {
                search.where['Task'] = { [Op.like]: '%' + filters.Task + '%' };
            }
            if (filters.Category != null) {
                search.where['Category'] = { [Op.like]: '%' + filters.Category + '%' };
            }
            if (filters.ActionType != null) {
                search.where['ActionType'] = { [Op.like]: '%' + filters.ActionType + '%' };
            }
            if (filters.Status != null) {
                if (filters.Status === ProgressStatus.InProgress) {
                    search.where['Started'] = true;
                    search.where['Finished'] = false;
                    search.where['Cancelled'] = false;
                }
                if (filters.Status === ProgressStatus.Pending) {
                    search.where['Started'] = false;
                    search.where['Finished'] = false;
                    search.where['Cancelled'] = false;
                    search.where['ScheduledStartTime'] = {
                        [Op.gte] : new Date(),
                    };
                }
                if (filters.Status === ProgressStatus.Delayed) {
                    search.where['Started'] = false;
                    search.where['Finished'] = false;
                    search.where['Cancelled'] = false;
                    search.where['ScheduledEndTime'] = {
                        [Op.lte] : new Date(),
                    };
                }
                if (filters.Status === ProgressStatus.Completed) {
                    search.where['Started'] = true;
                    search.where['Finished'] = true;
                    search.where['Cancelled'] = false;
                    search.where['FinishedAt'] = {
                        [Op.lte] : new Date(),
                    };
                }
                if (filters.Status === ProgressStatus.Cancelled) {
                    search.where['Cancelled'] = true;
                    search.where['CancelledAt'] = {
                        [Op.lte] : new Date(),
                    };
                }
            }

            if (filters.ScheduledFrom != null && filters.ScheduledTo != null) {
                //Sanitization
                if (TimeHelper.isAfter(filters.ScheduledFrom, filters.ScheduledTo)) {
                    var temp = filters.ScheduledFrom;
                    filters.ScheduledFrom = filters.ScheduledTo;
                    filters.ScheduledTo = temp;
                }

                const x = {
                    [Op.or] : [
                        {
                            ScheduledStartTime : {
                                [Op.gte] : filters.ScheduledFrom,
                                [Op.lte] : filters.ScheduledTo
                            }
                        },
                        {
                            ScheduledEndTime : {
                                [Op.gte] : filters.ScheduledFrom,
                                [Op.lte] : filters.ScheduledTo
                            }
                        },
                        {
                            [Op.and] : [
                                {
                                    ScheduledStartTime : {
                                        [Op.lte] : filters.ScheduledFrom,
                                    }
                                },
                                {
                                    ScheduledEndTime : {
                                        [Op.gte] : filters.ScheduledTo,
                                    }
                                }
                            ]
                        },
                        {
                            [Op.and] : [
                                {
                                    ScheduledStartTime : {
                                        [Op.gte] : filters.ScheduledFrom,
                                    }
                                },
                                {
                                    ScheduledEndTime : {
                                        [Op.lte] : filters.ScheduledTo,
                                    }
                                }
                            ]
                        },
                    ]
                };

                search.where = Object.assign(search.where, x);
            }
            else if (filters.ScheduledTo != null) {
                search.where['ScheduledStartTime'] = {
                    [Op.lte] : filters.ScheduledTo,
                };
            }
            else if (filters.ScheduledFrom != null) {
                search.where['ScheduledEndTime'] = {
                    [Op.gte] : filters.ScheduledFrom,
                };
            }

            if (filters.CreatedDateFrom != null && filters.CreatedDateTo != null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom === null && filters.CreatedDateTo !== null) {
                search.where['CreatedAt'] = {
                    [Op.lte] : filters.CreatedDateTo,
                };
            } else if (filters.CreatedDateFrom !== null && filters.CreatedDateTo === null) {
                search.where['CreatedAt'] = {
                    [Op.gte] : filters.CreatedDateFrom,
                };
            }

            let orderByColum = 'CreatedAt';
            if (filters.OrderBy) {
                orderByColum = filters.OrderBy;
            }
            let order = 'ASC';
            if (filters.Order === 'descending') {
                order = 'DESC';
            }
            search['order'] = [[orderByColum, order]];

            let limit = 25;
            if (filters.ItemsPerPage) {
                limit = filters.ItemsPerPage;
            }
            let offset = 0;
            let pageIndex = 0;
            if (filters.PageIndex) {
                pageIndex = filters.PageIndex < 0 ? 0 : filters.PageIndex;
                offset = pageIndex * limit;
            }
            search['limit'] = limit;
            search['offset'] = offset;

            const foundResults = await UserTask.findAndCountAll(search);

            const dtos: UserTaskDto[] = [];
            for (const userTask of foundResults.rows) {
                const dto = UserTaskMapper.toDto(userTask);
                dtos.push(dto);
            }

            const searchResults: UserTaskSearchResults = {
                TotalCount     : foundResults.count,
                RetrievedCount : dtos.length,
                PageIndex      : pageIndex,
                ItemsPerPage   : limit,
                Order          : order === 'DESC' ? 'descending' : 'ascending',
                OrderedBy      : orderByColum,
                Items          : dtos,
            };

            return searchResults;

        } catch (error) {
            Logger.instance().log(error.message);
            Logger.instance().log(JSON.stringify(error));
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, model: UserTaskDomainModel): Promise<UserTaskDto> => {
        try {
            const userTask = await UserTask.findByPk(id);

            if (model.UserId != null) {
                userTask.UserId = model.UserId;
            }

            if (model.Task != null) {
                userTask.Task = model.Task;
            }

            if (model.ScheduledStartTime != null) {
                userTask.ScheduledStartTime = model.ScheduledStartTime;
            }

            if (model.ScheduledEndTime != null) {
                userTask.ScheduledEndTime = model.ScheduledEndTime;
            }

            if (model.Task != null) {
                userTask.Task = model.Task;
            }

            if (model.Category != null) {
                userTask.Category = model.Category as UserTaskCategory;
            }

            if (model.ActionType != null) {
                userTask.ActionType = model.ActionType;
            }

            if (model.Description != null) {
                userTask.Description = model.Description;
            }

            if (model.ActionId != null) {
                userTask.ActionId = model.ActionId;
            }

            if (model.IsRecurrent != null) {
                userTask.IsRecurrent = model.IsRecurrent;
            }

            if (model.RecurrenceScheduleId != null) {
                userTask.RecurrenceScheduleId = model.RecurrenceScheduleId;
            }

            await userTask.save();

            return UserTaskMapper.toDto(userTask);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    startTask = async (id: string): Promise<UserTaskDto> => {

        var task = await UserTask.findByPk(id);
        if (task === null) {
            return null;
        }
        task.Started = true;
        task.StartedAt = new Date();
        task.Finished = false;
        task.FinishedAt = null;
        task.Cancelled = false;
        task.CancelledAt = null;
        task.CancellationReason = null;

        task = await task.save();

        return UserTaskMapper.toDto(task);
    };

    finishTask = async (id: string): Promise<UserTaskDto> => {

        var task = await UserTask.findByPk(id);
        if (task === null) {
            return null;
        }
        if (task.Started === false) {
            task.Started = true;
            task.StartedAt = new Date();
        }

        task.Finished = true;
        task.FinishedAt = new Date();
        task.Cancelled = false;
        task.CancelledAt = null;
        task.CancellationReason = null;

        task = await task.save();

        return UserTaskMapper.toDto(task);

    };

    cancelTask = async (id: string, reason: string): Promise<UserTaskDto> => {

        var task = await UserTask.findByPk(id);
        if (task === null) {
            return null;
        }

        task.Finished = false;
        task.FinishedAt = null;

        task.Cancelled = true;
        task.CancelledAt = new Date();
        task.CancellationReason = reason;

        task = await task.save();

        return UserTaskMapper.toDto(task);

    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const deleted = await UserTask.destroy({ where: { id: id } });
            return deleted === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getTaskSummaryForDay = async (userId: string, dateStr: string): Promise<TaskSummaryDto> => {
        try {

            var user = await User.findByPk(userId);
            if (user === null) {
                throw new Error(`User cannot be found!`);
            }
            var timezoneOffset = '+05:30';
            if (user.CurrentTimeZone !== null) {
                timezoneOffset = user.CurrentTimeZone;
            }
            else if (user.DefaultTimeZone !== null) {
                timezoneOffset = user.DefaultTimeZone;
            }
            var todayStr = new Date().toISOString();
            var str = dateStr ? dateStr.split('T')[0] : todayStr.split('T')[0];
            var offsetMinutes = TimeHelper.getTimezoneOffsets(timezoneOffset, DurationType.Minute);
            var dayStart = TimeHelper.strToUtc(str, offsetMinutes);
            var dayEnd = TimeHelper.addDuration(dayStart, 24, DurationType.Hour);

            var searchForFinished = {
                UserId             : userId,
                ScheduledStartTime : {
                    [Op.gte] : dayStart,
                    [Op.lte] : dayEnd
                },
                Cancelled : false,
                Finished  : true
            };
            const completed = await UserTask.findAndCountAll({ where: searchForFinished });
            const completedCount = completed.count;
            const completedTasks = completed.rows.map(x => UserTaskMapper.toDto(x));

            var searchForInProgress = {
                UserId             : userId,
                ScheduledStartTime : {
                    [Op.gte] : dayStart,
                    [Op.lte] : dayEnd
                },
                Cancelled : false,
                Started   : true,
                Finished  : false
            };
            const inProgress = await UserTask.findAndCountAll({ where: searchForInProgress });
            const inProgressCount = inProgress.count;
            const inProgressTasks = inProgress.rows.map(x => UserTaskMapper.toDto(x));

            var searchForPending = {
                UserId             : userId,
                ScheduledStartTime : {
                    [Op.gte] : dayStart,
                    [Op.lte] : dayEnd,
                },
                Cancelled : false,
                Started   : false,
                Finished  : false
            };
            const pending = await UserTask.findAndCountAll({ where: searchForPending });
            const pendingCount = pending.count;
            const pendingTasks = pending.rows.map(x => UserTaskMapper.toDto(x));

            const summary: TaskSummaryDto = {
                TotalCount      : completedCount + inProgressCount + pendingCount,
                CompletedCount  : completedCount,
                InProgressCount : inProgressCount,
                PendingCount    : pendingCount,
                CompletedTasks  : completedTasks,
                InProgressTasks : inProgressTasks,
                PendingTasks    : pendingTasks
            };

            return summary;

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getTaskForUserWithAction = async (userId: string, referenceId: string): Promise<UserTaskDto> => {
        try {
            const task = await UserTask.findOne({
                where : {
                    UserId   : userId,
                    ActionId : referenceId
                } }
            );
            return UserTaskMapper.toDto(task);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            const numDays = 30 * numMonths;
            const { stats, totalFinished, totalUnfinished } = await this.getDayByDayStats(patientUserId, numDays);
            return {
                TaskStats       : stats,
                TotalFinished   : totalFinished,
                TotalUnfinished : totalUnfinished,
            };
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUserEngagementStats = async (patientUserId: uuid, numMonths: number): Promise<any> => {
        try {
            const numDays = 30 * numMonths;
            var start = TimeHelper.subtractDuration(new Date(), numDays, DurationType.Day);
            var end = new Date();

            const unfinished = await UserTask.count({
                where : {
                    UserId             : patientUserId,
                    ScheduledStartTime : {
                        [Op.gte] : start,
                        [Op.lte] : end,
                    },
                    Cancelled : false,
                    Finished  : false
                }
            });
            const finished = await UserTask.count({
                where : {
                    UserId             : patientUserId,
                    ScheduledStartTime : {
                        [Op.gte] : start,
                        [Op.lte] : end,
                    },
                    Cancelled : false,
                    Finished  : true
                }
            });
            return {
                Finished   : finished,
                Unfinished : unfinished,
            };
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private async getDayByDayStats(patientUserId: string, numDays: number) {

        const offsetMinutes = await HelperRepo.getPatientTimezoneOffsets(patientUserId);
        const dayList = Array.from({ length: numDays }, (_, index) => index + 1);
        const reference = TimeHelper.getStartOfDay(new Date(), offsetMinutes);

        const stats = [];
        let totalUnfinished = 0;
        let totalFinished = 0;

        //Check whether the records exist or not
        const from = TimeHelper.subtractDuration(reference, numDays, DurationType.Day);
        const records = await UserTask.findAll({
            where : {
                UserId             : patientUserId,
                ScheduledStartTime : {
                    [Op.gte] : from,
                    [Op.lte] : new Date(),
                }
            }
        });
        if (records.length === 0) {
            return { stats, totalFinished, totalUnfinished };
        }

        for await (var day of dayList) {

            var dayStart = TimeHelper.subtractDuration(reference, day * 24, DurationType.Hour);
            var dayEnd = TimeHelper.subtractDuration(reference, (day - 1) * 24, DurationType.Hour);

            const dayStr = dayStart.toISOString().split('T')[0];

            const unfinished = await UserTask.count({
                where : {
                    UserId             : patientUserId,
                    ScheduledStartTime : {
                        [Op.gte] : dayStart,
                        [Op.lte] : dayEnd,
                    },
                    Cancelled : false,
                    Finished  : false
                }
            });
            const finished = await UserTask.count({
                where : {
                    UserId             : patientUserId,
                    ScheduledStartTime : {
                        [Op.gte] : dayStart,
                        [Op.lte] : dayEnd,
                    },
                    Cancelled : false,
                    Finished  : true
                }
            });
                
            stats.push({
                DayStr     : dayStr,
                Finished   : finished,
                Unfinished : unfinished,
            });

            totalFinished += finished;
            totalUnfinished += unfinished;
        }
        stats.sort((a, b) => new Date(a.DayStr).getTime() - new Date(b.DayStr).getTime());
        return { stats, totalFinished, totalUnfinished };
    }

}
