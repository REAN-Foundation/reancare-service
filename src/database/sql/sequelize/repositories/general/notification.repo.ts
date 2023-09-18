
import { NotificationSearchFilters, NotificationSearchResults } from '../../../../../domain.types/general/notification/notification.search.types';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { INotificationRepo } from '../../../../../database/repository.interfaces/general/notification.repo.interface';
import { NotificationDomainModel } from '../../../../../domain.types/general/notification/notification.domain.model';
import { NotificationDto } from '../../../../../domain.types/general/notification/notification.dto';
import { NotificationMapper } from '../../mappers/general/notification.mapper';
import NotificationModel from '../../models/general/notification.model';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////

export class NotificationRepo implements INotificationRepo {

    create = async (createModel: NotificationDomainModel):
    Promise<NotificationDto> => {

        try {
            const entity = {
                UserId         : createModel.UserId,
                BroadcastToAll : createModel.BroadcastToAll,
                Title          : createModel.Title,
                Body           : createModel.Body,
                Payload        : createModel.Payload ,
                SentOn         : createModel.SentOn,
                ReadOn         : createModel.ReadOn ,
                ImageUrl       : createModel.ImageUrl,
                Type           : createModel.Type,
            };

            const notification = await NotificationModel.create(entity);
            return await NotificationMapper.toDto(notification);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<NotificationDto> => {
        try {
            const notification = await NotificationModel.findByPk(id);
            return await NotificationMapper.toDto(notification);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    markAsRead = async (id: string, updateModel: NotificationDomainModel):
    Promise<NotificationDto> => {
        try {
            const notification = await NotificationModel.findByPk(id);

            if (updateModel.ReadOn != null && notification.BroadcastToAll !== true) {
                notification.ReadOn = updateModel.ReadOn;
            }

            await notification.save();

            return await NotificationMapper.toDto(notification);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: NotificationSearchFilters): Promise<NotificationSearchResults> => {
        try {

            let x = undefined;
            if (filters.UserId != null) {
                x = {
                    [Op.or] : [
                        {
                            UserId : filters.UserId,
                        },
                        {
                            BroadcastToAll : true
                        }
                    ]
                };
            }
            else {
                x = {
                    BroadcastToAll : true
                };
            }

            const search = { where: { ...x } };

            if (filters.Title != null) {
                search.where['Title'] = filters.Title;
            }

            if (filters.SentOn !== null) {
                search.where['SentOn'] = filters.SentOn;
            }
            if (filters.ReadOn !== null) {
                search.where['ReadOn'] = filters.ReadOn;
            }

            if (filters.Type !== null) {
                search.where['Type'] = filters.Type;
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

            const foundResults = await NotificationModel.findAndCountAll(search);

            const dtos: NotificationDto[] = [];
            for (const notification of foundResults.rows) {
                const dto = await NotificationMapper.toDto(notification);
                dtos.push(dto);
            }

            const searchResults: NotificationSearchResults = {
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

    update = async (id: string, updateModel: NotificationDomainModel):
    Promise<NotificationDto> => {
        try {
            const notification = await NotificationModel.findByPk(id);

            if (updateModel.Title != null) {
                notification.Title = updateModel.Title;
            }
            if (updateModel.Body != null) {
                notification.Body = updateModel.Body;
            }
            if (updateModel.Payload != null) {
                notification.Payload = updateModel.Payload;
            }
            if (updateModel.SentOn != null) {
                notification.SentOn = updateModel.SentOn;
            }
            if (updateModel.ReadOn != null) {
                notification.ReadOn = updateModel.ReadOn;
            }

            if (updateModel.ImageUrl != null) {
                notification.ImageUrl = updateModel.ImageUrl;
            }
            if (updateModel.Type != null) {
                notification.Type = updateModel.Type;
            }
            if (updateModel.BroadcastToAll != null) {
                notification.BroadcastToAll = updateModel.BroadcastToAll;
            }

            await notification.save();

            return await NotificationMapper.toDto(notification);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await NotificationModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
