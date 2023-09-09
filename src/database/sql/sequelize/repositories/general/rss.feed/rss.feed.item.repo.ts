
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import { RssfeedItemDomainModel } from '../../../../../../domain.types/general/rss.feed/rss.feed.domain.model';
import { RssfeedDto, RssfeedItemDto } from '../../../../../../domain.types/general/rss.feed/rss.feed.dto';
import { RssfeedMapper } from '../../../mappers/general/rss.feed/rss.feed.mapper';
import RssfeedItem from '../../../models/general/rss.feed/rss.feed.item.model';
import { IRssfeedItemRepo } from '../../../../../repository.interfaces/general/rss.feed/rss.feed.item.repo.interface';

///////////////////////////////////////////////////////////////////////

export class RssfeedItemRepo implements IRssfeedItemRepo {

    create = async (createModel: RssfeedItemDomainModel):
    Promise<RssfeedItemDto> => {

        try {
            const entity = {
                Title          : createModel.Title,
                FeedId         : createModel.FeedId,
                Description    : createModel.Description,
                Link           : createModel.Link ?? null,
                Content        : createModel.Content ?? '',
                Image          : createModel.Image ?? null,
                Tags           : createModel.Tags ?? '[]',
                AuthorName     : createModel.AuthorName ?? null,
                AuthorEmail    : createModel.AuthorEmail ?? null,
                AuthorLink     : createModel.AuthorLink ?? null,
                PublishingDate : createModel.PublishingDate ?? new Date()
            };

            const feedItem = await RssfeedItem.create(entity);
            const dto = RssfeedMapper.toFeedItemDto(feedItem);
            return  dto;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getById = async (id: string): Promise<RssfeedDto> => {
        try {
            const feedItem = await RssfeedItem.findByPk(id);
            return await RssfeedMapper.toFeedItemDto(feedItem);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByFeedId = async (feedId: string): Promise<RssfeedDto[]> => {
        try {
            const feedItems = await RssfeedItem.findAll({
                where : {
                    FeedId : feedId
                }
            });
            return feedItems.map(x => RssfeedMapper.toFeedItemDto(x));
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    update = async (id: string, updateModel: RssfeedItemDomainModel):
    Promise<RssfeedItemDto> => {
        try {
            const newsfeed = await RssfeedItem.findByPk(id);

            if (updateModel.Title != null) {
                newsfeed.Title = updateModel.Title;
            }
            if (updateModel.Description != null) {
                newsfeed.Description = updateModel.Description;
            }
            if (updateModel.Link != null) {
                newsfeed.Link = updateModel.Link;
            }
            if (updateModel.Content != null) {
                newsfeed.Content = updateModel.Content;
            }
            if (updateModel.Image != null) {
                newsfeed.Image = updateModel.Image;
            }
            if (updateModel.Tags != null) {
                newsfeed.Tags = JSON.stringify(updateModel.Tags);
            }
            if (updateModel.AuthorName != null) {
                newsfeed.AuthorName = updateModel.AuthorName;
            }
            if (updateModel.AuthorEmail != null) {
                newsfeed.AuthorEmail = updateModel.AuthorEmail;
            }
            if (updateModel.AuthorLink != null) {
                newsfeed.AuthorLink = updateModel.AuthorLink;
            }
            if (updateModel.PublishingDate != null) {
                newsfeed.PublishingDate = updateModel.PublishingDate;
            }

            await newsfeed.save();

            return await RssfeedMapper.toFeedItemDto(newsfeed);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    delete = async (id: string): Promise<boolean> => {
        try {
            const result = await RssfeedItem.destroy({ where: { id: id } });
            return result === 1;
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
