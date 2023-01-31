/* eslint-disable max-len */
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { ProgressStatus } from '../../../../../../domain.types/miscellaneous/system.types';
import { UserActionType, UserTaskCategory } from '../../../../../../domain.types/users/user.task/user.task.types';
import { CustomTaskDomainModel } from '../../../../../../domain.types/users/custom.task/custom.task.domain.model';
import { CustomTaskDto } from '../../../../../../domain.types/users/custom.task/custom.task.dto';
import { ICustomTaskRepo } from '../../../../../repository.interfaces/users/user/custom.task.repo.interface';
import { CustomTaskMapper } from '../../../mappers/users/user/custom.task.mapper';
import CustomTask from '../../../models/users/user/custom.task.model';

///////////////////////////////////////////////////////////////////////

export class CustomTaskRepo implements ICustomTaskRepo {

    create = async (model: CustomTaskDomainModel): Promise<CustomTaskDto> => {
        try {
            const entity = {
                UserId             : model.UserId,
                Task               : model.Task,
                Description        : model.Description,
                Details            : model.Details ? JSON.stringify(model.Details) : null,
                Category           : model.Category,
                ActionType         : UserActionType.Custom,
                Status             : ProgressStatus.Pending,
                ScheduledStartTime : model.ScheduledStartTime ?? new Date(),
                ScheduledEndTime   : model.ScheduledEndTime ?? null,
            };
            const task = await CustomTask.create(entity);
            return CustomTaskMapper.toDto(task);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<CustomTaskDto> => {
        try {
            const task = await CustomTask.findByPk(id);
            return CustomTaskMapper.toDto(task);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByActionId = async (actionId: string): Promise<CustomTaskDto> => {
        try {
            const task = await CustomTask.findOne({
                where : {
                    ActionId : actionId
                }
            });
            return CustomTaskMapper.toDto(task);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, model: CustomTaskDomainModel): Promise<CustomTaskDto> => {
        try {
            const task = await CustomTask.findByPk(id);

            if (model.UserId != null) {
                task.UserId = model.UserId;
            }

            if (model.ScheduledStartTime != null) {
                task.ScheduledStartTime = model.ScheduledStartTime;
            }

            if (model.ScheduledEndTime != null) {
                task.ScheduledEndTime = model.ScheduledEndTime;
            }

            if (model.Task != null) {
                task.Task = model.Task;
            }

            if (model.Description != null) {
                task.Description = model.Description;
            }

            if (model.Details != null) {
                task.Details = JSON.stringify(model.Details);
            }

            if (model.Category != null) {
                task.Category = model.Category as UserTaskCategory;
            }

            if (model.IsRecurrent != null) {
                task.IsRecurrent = model.IsRecurrent;
            }

            if (model.RecurrenceScheduleId != null) {
                task.RecurrenceScheduleId = model.RecurrenceScheduleId;
            }

            await task.save();

            return CustomTaskMapper.toDto(task);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    startTask = async (id: string): Promise<CustomTaskDto> => {

        var task = await CustomTask.findByPk(id);
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

        return CustomTaskMapper.toDto(task);
    };

    finishTask = async (id: string): Promise<CustomTaskDto> => {

        var task = await CustomTask.findByPk(id);
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

        return CustomTaskMapper.toDto(task);

    };

    cancelTask = async (id: string, cancellationTime?: Date, reason?: string): Promise<CustomTaskDto> => {

        var task = await CustomTask.findByPk(id);
        if (task === null) {
            return null;
        }

        task.Finished = false;
        task.FinishedAt = null;

        task.Cancelled = true;
        task.CancelledAt = cancellationTime ?? new Date();
        task.CancellationReason = reason ?? null;

        task = await task.save();

        return CustomTaskMapper.toDto(task);

    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const deleted = await CustomTask.destroy({ where: { id: id } });
            return deleted === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
