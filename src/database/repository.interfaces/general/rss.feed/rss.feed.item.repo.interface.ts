import { RssfeedItemDomainModel } from "../../../../domain.types/general/rss.feed/rss.feed.domain.model";
import { RssfeedItemDto } from "../../../../domain.types/general/rss.feed/rss.feed.dto";

export interface IRssfeedItemRepo {

    create(model: RssfeedItemDomainModel): Promise<RssfeedItemDto>;

    getById(id: string): Promise<RssfeedItemDto>;

    getByFeedId(feedId: string): Promise<RssfeedItemDto[]>;

    update(id: string, model: RssfeedItemDomainModel): Promise<RssfeedItemDto>;

    delete(id: string): Promise<boolean>;

}
