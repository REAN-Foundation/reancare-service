
import { RssfeedSearchFilters, RssfeedSearchResults } from '../../../../../../domain.types/general/rss.feed/rssfeed.search.types';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { IRssfeedRepo } from '../../../../../repository.interfaces/general/rss.feed/rss.feed.repo.interface';
import { RssfeedDomainModel } from '../../../../../../domain.types/general/rss.feed/rss.feed.domain.model';
import { RssfeedDto } from '../../../../../../domain.types/general/rss.feed/rss.feed.dto';
import { RssfeedMapper } from '../../../mappers/general/rss.feed/rss.feed.mapper';
import Rssfeed from '../../../models/general/rss.feed/rss.feed.model';
import { Op } from 'sequelize';

///////////////////////////////////////////////////////////////////////

export class RssfeedRepo implements IRssfeedRepo {

    create = async (createModel: RssfeedDomainModel):
    Promise<RssfeedDto> => {

        try {
            const entity = {
                Title         : createModel.Title,
                Description   : createModel.Description,
                Link          : createModel.Link ?? null,
                Language      : createModel.Language ?? 'en-us',
                Copyright     : createModel.Copyright ?? null,
                Favicon       : createModel.Favicon ?? null,
                Image         : createModel.Image ?? null,
                Category      : createModel.Category ?? null,
                Tags          : createModel.Tags ?? '[]',
                ProviderName  : createModel.ProviderName ?? null,
                ProviderEmail : createModel.ProviderEmail ?? null,
                ProviderLink  : createModel.ProviderLink ?? null,
                LastUpdatedOn : new Date()
            };

            const newsfeed = await Rssfeed.create(entity);
            return await RssfeedMapper.toFeedDto(newsfeed);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<RssfeedDto> => {
        try {
            const newsfeed = await Rssfeed.findByPk(id);
            return await RssfeedMapper.toFeedDto(newsfeed);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    search = async (filters: RssfeedSearchFilters): Promise<RssfeedSearchResults> => {
        try {

            const search = { where: {} };

            if (filters.Title != null) {
                search.where['Title'] = { [Op.like]: '%' + filters.Title + '%' };
            }

            if (filters.Category !== null) {
                search.where['Category'] = { [Op.like]: '%' + filters.Category + '%' };
            }
            if (filters.Tags !== null) {
                search.where['Tags'] = { [Op.like]: '%' + filters.Tags + '%' };
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

            const foundResults = await Rssfeed.findAndCountAll(search);

            const dtos: RssfeedDto[] = [];
            for (const feed of foundResults.rows) {
                const dto = await RssfeedMapper.toFeedDto(feed);
                dtos.push(dto);
            }

            const searchResults: RssfeedSearchResults = {
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

    update = async (id: string, updateModel: RssfeedDomainModel):
    Promise<RssfeedDto> => {
        try {
            const newsfeed = await Rssfeed.findByPk(id);

            if (updateModel.Title != null) {
                newsfeed.Title = updateModel.Title;
            }
            if (updateModel.Description != null) {
                newsfeed.Description = updateModel.Description;
            }
            if (updateModel.Link != null) {
                newsfeed.Link = updateModel.Link;
            }
            if (updateModel.Language != null) {
                newsfeed.Language = updateModel.Language;
            }
            if (updateModel.Copyright != null) {
                newsfeed.Copyright = updateModel.Copyright;
            }
            if (updateModel.Favicon != null) {
                newsfeed.Favicon = updateModel.Favicon;
            }
            if (updateModel.Image != null) {
                newsfeed.Image = updateModel.Image;
            }
            if (updateModel.Category != null) {
                newsfeed.Category = updateModel.Category;
            }
            if (updateModel.Tags != null) {
                newsfeed.Tags = JSON.stringify(updateModel.Tags);
            }
            if (updateModel.ProviderName != null) {
                newsfeed.ProviderName = updateModel.ProviderName;
            }
            if (updateModel.ProviderEmail != null) {
                newsfeed.ProviderEmail = updateModel.ProviderEmail;
            }
            if (updateModel.ProviderLink != null) {
                newsfeed.ProviderLink = updateModel.ProviderLink;
            }
            if (updateModel.AtomFeedLink != null) {
                newsfeed.AtomFeedLink = updateModel.AtomFeedLink;
            }
            if (updateModel.RssFeedLink != null) {
                newsfeed.RssFeedLink = updateModel.RssFeedLink;
            }
            if (updateModel.JsonFeedLink != null) {
                newsfeed.JsonFeedLink = updateModel.JsonFeedLink;
            }
            if (updateModel.RssFeedResourceId != null) {
                newsfeed.RssFeedResourceId = updateModel.RssFeedResourceId;
            }
            if (updateModel.AtomFeedResourceId != null) {
                newsfeed.AtomFeedResourceId = updateModel.AtomFeedResourceId;
            }
            if (updateModel.JsonFeedResourceId != null) {
                newsfeed.JsonFeedResourceId = updateModel.JsonFeedResourceId;
            }
            newsfeed.LastUpdatedOn = new Date();

            await newsfeed.save();

            return await RssfeedMapper.toFeedDto(newsfeed);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {

            const result = await Rssfeed.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
