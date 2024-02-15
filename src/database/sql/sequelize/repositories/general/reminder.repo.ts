import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import {
    ReminderType,
    ReminderDomainModel,
    ReminderDto,
    ReminderSearchFilters,
    ReminderSearchResults,
    RepeatAfterEveryNUnit,
    NotificationType }
    from '../../../../../domain.types/general/reminder/reminder.domain.model';
import { IReminderRepo } from '../../../../repository.interfaces/general/reminder.repo.interface';
import { ReminderMapper } from '../../mappers/general/reminder.mapper';
import Reminder from '../../models/general/reminder.model';

///////////////////////////////////////////////////////////////////////

export class ReminderRepo implements IReminderRepo {

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
                RepeatAfterEveryNUnit : model.RepeatAfterEveryNUnit ?? RepeatAfterEveryNUnit.Day,
                HookUrl               : model.HookUrl ?? null,
                NotificationType      : model.NotificationType ?? NotificationType.SMS,
                RawContent            : model.RawContent ?? null,
            };
            const reminder = await Reminder.create(entity);
            const dto = ReminderMapper.toDto(reminder);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ReminderDto> => {
        try {
            const reminder = await Reminder.findByPk(id);
            const dto = await ReminderMapper.toDto(reminder);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getRemindersForUser = async (userId: string): Promise<ReminderDto[]> => {
        try {
            const reminders = await Reminder.findAll({
                where : {
                    UserId : userId
                }
            });
            const dtos = reminders.map(x => ReminderMapper.toDto(x));
            return dtos;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: ReminderSearchFilters): Promise<ReminderSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.ReminderType != null) {
                search.where['ReminderType'] = { [Op.like]: '%' + filters.ReminderType + '%' };
            }
            if (filters.UserId != null) {
                search.where['UserId'] = filters.UserId;
            }
            if (filters.WhenDate != null) {
                search.where['WhenDate'] = filters.WhenDate;
            }
            if (filters.WhenTime != null) {
                search.where['WhenTime'] = filters.WhenTime;
            }

            let orderByColum = 'ReminderLine';
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

            const foundResults = await Reminder.findAndCountAll(search);

            const dtos: ReminderDto[] = [];
            for (const reminder of foundResults.rows) {
                const dto = await ReminderMapper.toDto(reminder);
                dtos.push(dto);
            }

            const searchResults: ReminderSearchResults = {
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

    delete = async (id: string): Promise<boolean> => {
        try {
            await Reminder.destroy({ where: { id: id } });
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

}
