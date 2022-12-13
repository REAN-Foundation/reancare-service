
import { RssfeedDto } from "../../../../../domain.types/general/rss.feed/rssfeed.dto";
import NewsfeedModel from '../../models/general/rss.feed/rss.feed.model';
import NewsfeedItemModel from '../../models/general/rss.feed/rss.feed.item.model';

///////////////////////////////////////////////////////////////////////////////////

export class NewsfeedMapper {

    static toDto = (
        newsfeed: NewsfeedModel): RssfeedDto => {
        if (newsfeed == null) {
            return null;
        }
        const dto: RssfeedDto = {
            id       : newsfeed.id,
            UserId   : newsfeed.UserId,
            Title    : newsfeed.Title,
            Body     : newsfeed.Body,
            Payload  : newsfeed.Payload,
            SentOn   : newsfeed.SentOn,
            ReadOn   : newsfeed.ReadOn,
            ImageUrl : newsfeed.ImageUrl,
            Type     : newsfeed.Type,
        };
        return dto;
    };

}
