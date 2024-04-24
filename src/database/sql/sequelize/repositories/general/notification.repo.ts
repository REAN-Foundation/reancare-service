
import {
    NotificationCreateModel,
    NotificationSearchFilters,
    NotificationSearchResults,
    NotificationDto,
    NotificationUpdateModel,
    UserNotificationDto
} from '../../../../../domain.types/general/notification/notification.types';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { INotificationRepo } from '../../../../../database/repository.interfaces/general/notification.repo.interface';
import { NotificationMapper } from '../../mappers/general/notification.mapper';
import Notification from '../../models/general/notification/notification.model';
import UserNotification from '../../models/general/notification/user.notification.model';
import { Op } from 'sequelize';
import { uuid } from '../../../../../domain.types/miscellaneous/system.types';

///////////////////////////////////////////////////////////////////////

export class NotificationRepo implements INotificationRepo {

    create = async (createModel: NotificationCreateModel):
    Promise<NotificationDto> => {

        try {
            const entity = {
                TenantId        : createModel.TenantId ?? null,
                Target          : createModel.Target,
                Type            : createModel.Type,
                Channel         : createModel.Channel,
                Title           : createModel.Title,
                Body            : createModel.Body,
                Payload         : createModel.Payload ,
                SentOn          : createModel.SentOn,
                ImageUrl        : createModel.ImageUrl,
                CreatedByUserId : createModel.CreatedByUserId,
            };

            const notification = await Notification.create(entity);
            return await NotificationMapper.toDto(notification);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<NotificationDto> => {
        try {
            const notification = await Notification.findByPk(id);
            return await NotificationMapper.toDto(notification);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: NotificationSearchFilters): Promise<NotificationSearchResults> => {
        try {

            let x = undefined;
            if (filters.TenantId != null) {
                x = {
                    [Op.or] : [
                        {
                            TenantId : filters.TenantId
                        }
                    ]
                };
            }

            const search = { where: { ...x } };

            if (filters.Title != null) {
                search.where['Title'] = { [Op.like]: '%' + filters.Title + '%' };
            }

            if (filters.SentOnFrom != null && filters.SentOnTo != null) {
                search.where['SentOn'] = {
                    [Op.gte] : filters.SentOnFrom,
                    [Op.lte] : filters.SentOnTo,
                };
            } else if (filters.SentOnFrom === null && filters.SentOnTo !== null) {
                search.where['SentOn'] = {
                    [Op.lte] : filters.SentOnTo,
                };
            } else if (filters.SentOnFrom !== null && filters.SentOnTo === null) {
                search.where['SentOn'] = {
                    [Op.gte] : filters.SentOnFrom,
                };
            }

            if (filters.Target !== null) {
                search.where['Target'] = filters.Target;
            }

            if (filters.Channel !== null) {
                search.where['Channel'] = filters.Channel;
            }

            if (filters.Type !== null) {
                search.where['Type'] = filters.Type;
            }

            const { pageIndex, limit, order, orderByColum } = this.updateCommonSearchParams(filters, search);

            const foundResults = await Notification.findAndCountAll(search);

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

    update = async (id: string, updateModel: NotificationUpdateModel):
    Promise<NotificationDto> => {
        try {
            const notification = await Notification.findByPk(id);

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
            if (updateModel.Target != null) {
                notification.Target = updateModel.Target;
            }
            if (updateModel.Channel != null) {
                notification.Channel = updateModel.Channel;
            }
            if (updateModel.Type != null) {
                notification.Type = updateModel.Type;
            }

            if (updateModel.ImageUrl != null) {
                notification.ImageUrl = updateModel.ImageUrl;
            }
            if (updateModel.Type != null) {
                notification.Type = updateModel.Type;
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
            const result = await Notification.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    markAsRead = async (id: string, userId: uuid):
    Promise<boolean> => {
        try {
            const userNotification = await UserNotification.findOne({
                where : {
                    NotificationId : id,
                    UserId         : userId,
                }

            });
            if (userNotification == null) {
                throw new ApiError(404, 'Notification not found');
            }

            userNotification.ReadOn = new Date();
            await userNotification.save();
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    sendToUser = async (id: string, userId: string): Promise<boolean> => {
        try {
            const userNotification = await UserNotification.create({
                UserId         : userId,
                NotificationId : id,
            });
            return userNotification != null;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getUserNotification = async (id: string, userId: string): Promise<UserNotificationDto> => {
        try {
            const userNotification = await UserNotification.findOne({
                where : {
                    NotificationId : id,
                    UserId         : userId,
                }
            });
            if (userNotification == null) {
                throw new ApiError(404, 'Notification not found');
            }
            const notification = await Notification.findByPk(id);
            const notificationDto = NotificationMapper.toDto(notification);
            const dto: UserNotificationDto = {
                id             : userNotification.id,
                UserId         : userNotification.UserId,
                NotificationId : userNotification.NotificationId,
                Notification   : notificationDto,
                ReadOn         : userNotification.ReadOn,
            };
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    private updateCommonSearchParams = (filters: NotificationSearchFilters, search: { where: any; }) => {
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
        return { pageIndex, limit, order, orderByColum };
    };

}
