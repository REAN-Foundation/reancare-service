/* eslint-disable max-len */
import moment from 'moment';
import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { TimeHelper } from '../../../../../common/time.helper';
import { DurationType } from '../../../../../domain.types/miscellaneous/time.types';
import { UserTaskDomainModel } from '../../../../../domain.types/user/user.task/user.task.domain.model';
import { UserTaskDto } from '../../../../../domain.types/user/user.task/user.task.dto';
import { UserTaskSearchFilters, UserTaskSearchResults } from '../../../../../domain.types/user/user.task/user.task.search.types';
import { IUserTaskRepo } from '../../../../repository.interfaces/user/user.task.repo.interface';
import { UserTaskMapper } from '../../mappers/user/user.task.mapper';
import UserTask from '../../models/user/user.task.model';
import { UserRepo } from './user.repo';

// import { UserTaskCategoryDomainModel } from '../../../../domain.types/user/user.task/user.task.category.domain.model';

///////////////////////////////////////////////////////////////////////

const _userTaskRepo = new UserRepo();

export class UserTaskRepo implements IUserTaskRepo {

    create = async (userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto> => {
        try {
            const entity = {
                DisplayId            : userTaskDomainModel.DisplayId ?? null,
                UserId               : userTaskDomainModel.UserId ?? null,
                UserRole             : userTaskDomainModel.UserRole ?? null,
                TaskName             : userTaskDomainModel.TaskName ?? null,
                Category             : userTaskDomainModel.Category ?? null,
                Action               : userTaskDomainModel.Action ?? null,
                ScheduledStartTime   : userTaskDomainModel.ScheduledStartTime ?? null,
                ScheduledEndTime     : userTaskDomainModel.ScheduledEndTime ?? null,
                Started              : userTaskDomainModel.Started ?? null,
                StartedAt            : userTaskDomainModel.StartedAt ?? null,
                Finished             : userTaskDomainModel.Finished ?? null,
                FinishedAt           : userTaskDomainModel.FinishedAt ?? null,
                TaskIsSuccess        : userTaskDomainModel.TaskIsSuccess ?? null,
                Cancelled            : userTaskDomainModel.Cancelled ?? null,
                CancelledAt          : userTaskDomainModel.CancelledAt ?? null,
                CancellationReason   : userTaskDomainModel.CancellationReason ?? null,
                IsRecurrent          : userTaskDomainModel.IsRecurrent ?? null,
                RecurrenceScheduleId : userTaskDomainModel.RecurrenceScheduleId ?? null,
            };
            const userTask = await UserTask.create(entity);
            const dto = await UserTaskMapper.toDto(userTask);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<UserTaskDto> => {
        try {
            const userTask = await UserTask.findByPk(id);
            const dto = await UserTaskMapper.toDto(userTask);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: UserTaskSearchFilters): Promise<UserTaskSearchResults> => {
        try {
            const search = { where: {} };

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

            let orderByColum = 'UserTaskLine';
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
                const dto = await UserTaskMapper.toDto(userTask);
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
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto> => {
        try {
            const userTask = await UserTask.findByPk(id);

            if (userTaskDomainModel.DisplayId != null) {
                userTask.DisplayId = userTaskDomainModel.DisplayId;
            }

            if (userTaskDomainModel.UserId != null) {
                userTask.UserId = userTaskDomainModel.UserId;
            }

            if (userTaskDomainModel.TaskName != null) {
                userTask.TaskName = userTaskDomainModel.TaskName;
            }

            if (userTaskDomainModel.ScheduledStartTime != null) {
                userTask.ScheduledStartTime = userTaskDomainModel.ScheduledStartTime;
            }

            if (userTaskDomainModel.ScheduledEndTime != null) {
                userTask.ScheduledEndTime = userTaskDomainModel.ScheduledEndTime;
            }

            if (userTaskDomainModel.Started != null) {
                userTask.Started = userTaskDomainModel.Started;
            }

            if (userTaskDomainModel.StartedAt != null) {
                userTask.StartedAt = userTaskDomainModel.StartedAt;
            }

            if (userTaskDomainModel.Finished != null) {
                userTask.Finished = userTaskDomainModel.Finished;
            }

            if (userTaskDomainModel.FinishedAt != null) {
                userTask.FinishedAt = userTaskDomainModel.FinishedAt;
            }

            if (userTaskDomainModel.TaskIsSuccess != null) {
                userTask.TaskIsSuccess = userTaskDomainModel.TaskIsSuccess;
            }

            if (userTaskDomainModel.Cancelled != null) {
                userTask.Cancelled = userTaskDomainModel.Cancelled;
            }

            if (userTaskDomainModel.CancelledAt != null) {
                userTask.CancelledAt = userTaskDomainModel.CancelledAt;
            }

            if (userTaskDomainModel.CancellationReason != null) {
                userTask.CancellationReason = userTaskDomainModel.CancellationReason;
            }

            if (userTaskDomainModel.IsRecurrent != null) {
                userTask.IsRecurrent = userTaskDomainModel.IsRecurrent;
            }

            if (userTaskDomainModel.RecurrenceScheduleId != null) {
                userTask.RecurrenceScheduleId = userTaskDomainModel.RecurrenceScheduleId;
            }

            await userTask.save();

            const dto = await UserTaskMapper.toDto(userTask);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    startTask = async (id: string, userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto> => {
        userTaskDomainModel.Started = true;
        userTaskDomainModel.StartedAt = new Date();
        const updatedRecord = await this.update(id, userTaskDomainModel);

        return updatedRecord;
    }

    finishTask = async (id: string, userTaskDomainModel: UserTaskDomainModel): Promise<UserTaskDto> => {
        userTaskDomainModel.Finished = true;
        userTaskDomainModel.FinishedAt = new Date();
        const updatedRecord = await this.update(id, userTaskDomainModel);

        return updatedRecord;
    }

    delete = async (id: string): Promise<boolean> => {
        try {
            await UserTask.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getTasksForTodaySummary = async (patientUserId: string): Promise<UserTaskSearchResults> => {
        try {
            const search = { where : {
                userId : patientUserId,
            } };

            var str = new Date().toDateString();
            var m = moment(str);
            var existingUser = await _userTaskRepo.getById(patientUserId);
            var timeZone = existingUser.CurrentTimeZone || existingUser.DefaultTimeZone;
            if (timeZone == null) {
                timeZone = "+05:30";
            }

            var offset = await TimeHelper.getTimezoneOffsets(timeZone, DurationType.Second);

            var day_start = m.clone().utc()
                .add(offset, 'seconds')
                .toDate();
            var day_end = m.clone().utc()
                .add(offset + 24 * 60 * 60, 'seconds')
                .toDate();
            search.where['ScheduledStartTime'] = {
                [Op.gte] : day_start,
                [Op.lte] : day_end,
            };

            search.where['Finished'] = true;
            var completedEntities = await UserTask.findAndCountAll(search);
            const dtos: UserTaskDto[] = [];
            for (const userTask of completedEntities.rows) {
                const dto = await UserTaskMapper.toDto(userTask);
                dtos.push(dto);
            }

            search.where['Finished'] = false;
            var incompletedEntities = await UserTask.findAndCountAll(search);
            for (const userTask of incompletedEntities.rows) {
                const dto = await UserTaskMapper.toDto(userTask);
                dtos.push(dto);
            }

            const searchResults: UserTaskSearchResults = {
                TotalCount     : dtos.length,
                RetrievedCount : dtos.length,
                Items          : dtos,
                PageIndex      : 0,
                ItemsPerPage   : 0,
                Order          : '',
                OrderedBy      : ''
            };

            return searchResults;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
