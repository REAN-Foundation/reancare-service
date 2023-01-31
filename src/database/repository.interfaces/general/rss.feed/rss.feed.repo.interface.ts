import { RssfeedDomainModel } from "../../../../domain.types/general/rss.feed/rss.feed.domain.model";
import { RssfeedDto } from "../../../../domain.types/general/rss.feed/rss.feed.dto";
import { RssfeedSearchResults } from "../../../../domain.types/general/rss.feed/rssfeed.search.types";
import { RssfeedSearchFilters } from "../../../../domain.types/general/rss.feed/rssfeed.search.types";

export interface IRssfeedRepo {

    create(model: RssfeedDomainModel): Promise<RssfeedDto>;

    getById(id: string): Promise<RssfeedDto>;

    search(filters: RssfeedSearchFilters): Promise<RssfeedSearchResults>;

    update(id: string, model: RssfeedDomainModel): Promise<RssfeedDto>;

    delete(id: string): Promise<boolean>;

}
