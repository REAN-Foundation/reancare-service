import { RssfeedDomainModel } from "../../../../domain.types/general/rss.feed/rss.feed.domain.model";
import { RssfeedDto } from "../../../../domain.types/general/rss.feed/rss.feed.dto";

export interface IRssfeedItemRepo {

    create(model: RssfeedDomainModel): Promise<RssfeedDto>;

    getById(id: string): Promise<RssfeedDto>;

    update(id: string, model: RssfeedDomainModel): Promise<RssfeedDto>;

    delete(id: string): Promise<boolean>;

}
