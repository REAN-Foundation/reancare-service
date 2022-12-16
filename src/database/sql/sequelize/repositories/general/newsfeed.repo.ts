
import { NewsfeedSearchFilters, NewsfeedSearchResults } from '../../../../../domain.types/general/newsfeed/newsfeed.search.types';
import { ApiError } from '../../../../../common/api.error';
import { Logger } from '../../../../../common/logger';
import { INewsfeedRepo } from '../../../../repository.interfaces/general/newsfeed.repo.interface';
import { NewsfeedDomainModel } from '../../../../../domain.types/general/newsfeed/newsfeed.domain.model';
import { NewsfeedDto } from '../../../../../domain.types/general/newsfeed/newsfeed.dto';
import { NewsfeedMapper } from '../../mappers/general/newsfeed.mapper';
import NewsfeedModel from '../../models/general/newsfeed/newsfeed.model';
import NewsfeedItemModel from '../../models/general/newsfeed/newsfeed.item.model';

///////////////////////////////////////////////////////////////////////

export class NewsfeedRepo implements INewsfeedRepo {

    create = async (createModel: NewsfeedDomainModel):
    Promise<NewsfeedDto> => {

        try {
            const entity = {
                UserId   : createModel.UserId,
                Title    : createModel.Title,
                Body     : createModel.Body,
                Payload  : createModel.Payload ,
                SentOn   : createModel.SentOn,
                ReadOn   : createModel.ReadOn ,
                ImageUrl : createModel.ImageUrl,
                Type     : createModel.Type,
            };

            const newsfeed = await NewsfeedModel.create(entity);
            return await NewsfeedMapper.toDto(newsfeed);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<NewsfeedDto> => {
        try {
            const newsfeed = await NewsfeedModel.findByPk(id);
            return await NewsfeedMapper.toDto(newsfeed);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    markAsRead = async (id: string, updateModel: NewsfeedDomainModel):
    Promise<NewsfeedDto> => {
        try {
            const newsfeed = await NewsfeedModel.findByPk(id);

            if (updateModel.ReadOn != null) {
                newsfeed.ReadOn = updateModel.ReadOn;
            }

            await newsfeed.save();

            return await NewsfeedMapper.toDto(newsfeed);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: NewsfeedSearchFilters): Promise<NewsfeedSearchResults> => {
        try {

            const search = { where: {} };

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

            const foundResults = await NewsfeedModel.findAndCountAll(search);

            const dtos: NewsfeedDto[] = [];
            for (const newsfeed of foundResults.rows) {
                const dto = await NewsfeedMapper.toDto(newsfeed);
                dtos.push(dto);
            }

            const searchResults: NewsfeedSearchResults = {
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

    update = async (id: string, updateModel: NewsfeedDomainModel):
    Promise<NewsfeedDto> => {
        try {
            const newsfeed = await NewsfeedModel.findByPk(id);

            if (updateModel.Title != null) {
                newsfeed.Title = updateModel.Title;
            }
            if (updateModel.Body != null) {
                newsfeed.Body = updateModel.Body;
            }
            if (updateModel.Payload != null) {
                newsfeed.Payload = updateModel.Payload;
            }
            if (updateModel.SentOn != null) {
                newsfeed.SentOn = updateModel.SentOn;
            }
            if (updateModel.ReadOn != null) {
                newsfeed.ReadOn = updateModel.ReadOn;
            }

            if (updateModel.ImageUrl != null) {
                newsfeed.ImageUrl = updateModel.ImageUrl;
            }
            if (updateModel.Type != null) {
                newsfeed.Type = updateModel.Type;
            }

            await newsfeed.save();

            return await NewsfeedMapper.toDto(newsfeed);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await NewsfeedModel.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
