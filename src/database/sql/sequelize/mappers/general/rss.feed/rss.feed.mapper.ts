
import { RssfeedDto, RssfeedItemDto } from "../../../../../../domain.types/general/rss.feed/rss.feed.dto";
import RssfeedItem from "../../../models/general/rss.feed/rss.feed.item.model";
import Rssfeed from '../../../models/general/rss.feed/rss.feed.model';

///////////////////////////////////////////////////////////////////////////////////

export class RssfeedMapper {

    static toFeedDto = (
        feed: Rssfeed,
        feedItems: RssfeedItemDto[]): RssfeedDto => {

        if (feed == null) {
            return null;
        }

        const dto: RssfeedDto = {
            id                 : feed.id,
            Title              : feed.Title,
            Description        : feed.Description,
            Link               : feed.Link,
            Language           : feed.Language,
            Copyright          : feed.Copyright,
            Favicon            : feed.Favicon,
            Updated            : feed.LastUpdatedOn,
            Image              : feed.Image,
            Category           : feed.Category,
            Tags               : JSON.parse(feed.Tags),
            ProviderName       : feed.ProviderName,
            ProviderEmail      : feed.ProviderEmail,
            ProviderLink       : feed.ProviderLink,
            AtomFeedLink       : feed.AtomFeedLink,
            JsonFeedLink       : feed.JsonFeedLink,
            RssFeedLink        : feed.RssFeedLink,
            AtomFeedResourceId : feed.AtomFeedResourceId,
            JsonFeedResourceId : feed.JsonFeedResourceId,
            RssFeedResourceId  : feed.RssFeedResourceId,
            FeedItems          : feedItems ?? [],
            CreatedAt          : feed.CreatedAt,
        };
        return dto;
    };

    static toFeedItemDto = (
        feedItem: RssfeedItem): RssfeedItemDto => {
        if (feedItem == null) {
            return null;
        }

        const dto: RssfeedItemDto = {
            id             : feedItem.id,
            FeedId         : feedItem.FeedId,
            Title          : feedItem.Title,
            Description    : feedItem.Description,
            Link           : feedItem.Link,
            Content        : feedItem.Content,
            Image          : feedItem.Image,
            Tags           : JSON.parse(feedItem.Tags),
            PublishingDate : feedItem.PublishingDate,
            AuthorName     : feedItem.AuthorName,
            AuthorEmail    : feedItem.AuthorEmail,
            AuthorLink     : feedItem.AuthorLink,
        };
        return dto;
    };

}
