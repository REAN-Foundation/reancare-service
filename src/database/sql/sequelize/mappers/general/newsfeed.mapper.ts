
import { NewsfeedDto } from "../../../../../domain.types/general/newsfeed/newsfeed.dto";
import NewsfeedModel from '../../models/general/newsfeed/newsfeed.model';
import NewsfeedItemModel from '../../models/general/newsfeed/newsfeed.item.model';

///////////////////////////////////////////////////////////////////////////////////

export class NewsfeedMapper {

    static toDto = (
        newsfeed: NewsfeedModel): NewsfeedDto => {
        if (newsfeed == null) {
            return null;
        }
        const dto: NewsfeedDto = {
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
