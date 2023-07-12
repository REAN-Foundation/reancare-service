import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import {
    ReminderType,
    FrequencyType,
    ReminderDomainModel,
    ReminderDto,
    ReminderSearchFilters,
    ReminderSearchResults }
    from '../../../../../domain.types/general/reminder/reminder.domain.model';
import { IReminderRepo } from '../../../../repository.interfaces/general/reminder.repo.interface';
import { ReminderMapper } from '../../mappers/general/reminder.mapper';
import Reminder from '../../models/general/reminder.model';

///////////////////////////////////////////////////////////////////////

export class ReminderRepo implements IReminderRepo {

    create = async (model: ReminderDomainModel): Promise<ReminderDto> => {
        try {
            const entity = {
                Name                 : model.Name,
                UserId               : model.UserId,
                ReminderType         : model.ReminderType ?? ReminderType.OneTime,
                FrequencyType        : model.FrequencyType ?? FrequencyType.DoesNotRepeat,
                FrequencyCount       : model.FrequencyCount ?? 0,
                DateAndTime          : model.DateAndTime ?? null,
                StartDate            : model.StartDate ?? new Date(),
                EndDate              : model.EndDate ?? null,
                EndAfterNRepetitions : model.EndAfterNRepetitions ?? 10,
                RepeatList           : model.RepeatList ? JSON.stringify(model.RepeatList) : '[]',
                HookUrl              : model.HookUrl ?? null,
            };
            const reminder = await Reminder.create(entity);
            const dto = await ReminderMapper.toDto(reminder);
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

    search = async (filters: ReminderSearchFilters): Promise<ReminderSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Name != null) {
                search.where['Name'] = { [Op.like]: '%' + filters.Name + '%' };
            }
            if (filters.ReminderType != null) {
                search.where['ReminderType'] = { [Op.like]: '%' + filters.ReminderType + '%' };
            }
            if (filters.FrequencyType != null) {
                search.where['FrequencyType'] = { [Op.like]: '%' + filters.FrequencyType + '%' };
            }
            if (filters.UserId != null) {
                search.where['UserId'] = filters.UserId;
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

    update = async (id: string, model: ReminderDomainModel): Promise<ReminderDto> => {
        try {
            const reminder = await Reminder.findByPk(id);

            if (model.ReminderType !== undefined) {
                reminder.ReminderType = model.ReminderType;
            }
            if (model.FrequencyType !== undefined) {
                reminder.FrequencyType = model.FrequencyType;
            }
            if (model.Name) {
                reminder.Name = model.Name;
            }
            if (model.FrequencyCount) {
                reminder.FrequencyCount = model.FrequencyCount;
            }
            if (model.DateAndTime) {
                reminder.DateAndTime = model.DateAndTime;
            }
            if (model.EndAfterNRepetitions) {
                reminder.EndAfterNRepetitions = model.EndAfterNRepetitions;
            }
            if (model.RepeatList && model.RepeatList.length > 0) {
                reminder.RepeatList = JSON.stringify(model.RepeatList);
            }
            if (model.StartDate) {
                reminder.StartDate = model.StartDate;
            }
            if (model.EndDate) {
                reminder.EndDate = model.EndDate;
            }
            if (model.HookUrl !== undefined) {
                reminder.HookUrl = model.HookUrl;
            }
            await reminder.save();

            const dto = await ReminderMapper.toDto(reminder);
            return dto;
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

}
