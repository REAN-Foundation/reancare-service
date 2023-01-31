import { RssfeedDomainModel } from "../../../../domain.types/general/rss.feed/rss.feed.domain.model";
import { RssfeedItemDto } from "../../../../domain.types/general/rss.feed/rss.feed.dto";

export interface IRssfeedItemRepo {

    create(model: RssfeedDomainModel): Promise<RssfeedItemDto>;

    getById(id: string): Promise<RssfeedItemDto>;

    getByFeedId(feedId: string): Promise<RssfeedItemDto[]>;

    update(id: string, model: RssfeedDomainModel): Promise<RssfeedItemDto>;

    delete(id: string): Promise<boolean>;

}
