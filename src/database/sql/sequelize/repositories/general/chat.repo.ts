import { Op } from 'sequelize';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { ChatDomainModel } from '../../../../../domain.types/general/chat/chat.domain.model';
import { ChatDto } from '../../../../../domain.types/general/chat/chat.dto';
import { ChatSearchFilters, ChatSearchResults } from '../../../../../domain.types/general/chat/chat.search.types';
import { IChatRepo } from '../../../../repository.interfaces/general/chat.repo.interface';
import { ChatMapper } from '../../mappers/general/chat.mapper';
import Chat from '../../models/general/chat.model';

///////////////////////////////////////////////////////////////////////

export class ChatRepo implements IChatRepo {

    create = async (chatDomainModel: ChatDomainModel): Promise<ChatDto> => {
        try {
            const entity = {
                Type        : chatDomainModel.Type,
                ChatLine : chatDomainModel.ChatLine ?? null,
                City        : chatDomainModel.City ?? null,
                District    : chatDomainModel.District ?? null,
                State       : chatDomainModel.State ?? null,
                Country     : chatDomainModel.Country ?? null,
                PostalCode  : chatDomainModel.PostalCode ?? null,
                Longitude   : chatDomainModel.Longitude ?? null,
                Lattitude   : chatDomainModel.Lattitude ?? null,
                Location    : chatDomainModel.Location ?? null,
            };
            const chat = await Chat.create(entity);
            const dto = await ChatMapper.toDto(chat);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<ChatDto> => {
        try {
            const chat = await Chat.findByPk(id);
            const dto = await ChatMapper.toDto(chat);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: ChatSearchFilters): Promise<ChatSearchResults> => {
        try {
            const search = { where: {} };

            if (filters.Type != null) {
                search.where['Type'] = { [Op.like]: '%' + filters.Type + '%' };
            }
            if (filters.ChatLine != null) {
                search.where['ChatLine'] = { [Op.like]: '%' + filters.ChatLine + '%' };
            }
            if (filters.City != null) {
                search.where['City'] = { [Op.like]: '%' + filters.City + '%' };
            }
            if (filters.District != null) {
                search.where['District'] = { [Op.like]: '%' + filters.District + '%' };
            }
            if (filters.State != null) {
                search.where['State'] = { [Op.like]: '%' + filters.State + '%' };
            }
            if (filters.Country != null) {
                search.where['Country'] = { [Op.like]: '%' + filters.Country + '%' };
            }
            if (filters.PostalCode != null) {
                search.where['PostalCode'] = { [Op.like]: '%' + filters.PostalCode + '%' };
            }
            if (filters.LongitudeFrom != null && filters.LongitudeTo != null) {
                search.where['Longitude'] = {
                    [Op.gte] : filters.LongitudeFrom,
                    [Op.lte] : filters.LongitudeTo,
                };
            }
            if (filters.LattitudeFrom != null && filters.LattitudeTo != null) {
                search.where['Lattitude'] = {
                    [Op.gte] : filters.LattitudeFrom,
                    [Op.lte] : filters.LattitudeTo,
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
            if (filters.PostalCode !== null) {
                search.where['PostalCode'] = { [Op.like]: '%' + filters.PostalCode + '%' };
            }

            let orderByColum = 'ChatLine';
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

            const foundResults = await Chat.findAndCountAll(search);

            const dtos: ChatDto[] = [];
            for (const chat of foundResults.rows) {
                const dto = await ChatMapper.toDto(chat);
                dtos.push(dto);
            }

            const searchResults: ChatSearchResults = {
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

    update = async (id: string, chatDomainModel: ChatDomainModel): Promise<ChatDto> => {
        try {
            const chat = await Chat.findByPk(id);

            if (chatDomainModel.Type !== undefined &&
                chatDomainModel.Type !== null) {
                chat.Type = chatDomainModel.Type;
            }
            if (chatDomainModel.ChatLine !== undefined &&
                chatDomainModel.ChatLine !== null) {
                chat.ChatLine = chatDomainModel.ChatLine;
            }
            if (chatDomainModel.City !== undefined) {
                chat.City = chatDomainModel.City;
            }
            if (chatDomainModel.District !== undefined) {
                chat.District = chatDomainModel.District;
            }
            if (chatDomainModel.State !== undefined) {
                chat.State = chatDomainModel.State;
            }
            if (chatDomainModel.Country !== undefined) {
                chat.Country = chatDomainModel.Country;
            }
            if (chatDomainModel.PostalCode !== undefined) {
                chat.PostalCode = chatDomainModel.PostalCode;
            }
            if (chatDomainModel.Longitude !== undefined) {
                chat.Longitude = chatDomainModel.Longitude;
            }
            if (chatDomainModel.Lattitude !== undefined) {
                chat.Lattitude = chatDomainModel.Lattitude;
            }
            await chat.save();

            const dto = await ChatMapper.toDto(chat);
            return dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            await Chat.destroy({ where: { id: id } });
            return true;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
