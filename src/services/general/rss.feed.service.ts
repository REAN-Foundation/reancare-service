import { IRssfeedRepo } from "../../database/repository.interfaces/general/rss.feed/rss.feed.repo.interface";
import { RssfeedDto, RssfeedItemDto } from "../../domain.types/general/rss.feed/rss.feed.dto";
import { RssfeedDomainModel, RssfeedItemDomainModel } from "../../domain.types/general/rss.feed/rss.feed.domain.model";
import { RssfeedSearchResults } from "../../domain.types/general/rss.feed/rssfeed.search.types";
import { RssfeedSearchFilters } from "../../domain.types/general/rss.feed/rssfeed.search.types";
import { inject, injectable } from "tsyringe";
import { IRssfeedItemRepo } from "../../database/repository.interfaces/general/rss.feed/rss.feed.item.repo.interface";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class RssfeedService {

    constructor(
        @inject('IRssfeedRepo') private _feedRepo: IRssfeedRepo,
        @inject('IRssfeedItemRepo') private _feedItemRepo: IRssfeedItemRepo,
    ) {}

    create = async (model: RssfeedDomainModel ): Promise<RssfeedDto> => {
        return await this._feedRepo.create(model);
    };

    getById = async (id: string): Promise<RssfeedDto> => {
        return await this._feedRepo.getById(id);
    };

    search = async (filters: RssfeedSearchFilters): Promise<RssfeedSearchResults> => {
        return await this._feedRepo.search(filters);
    };

    update = async (id: string, model: RssfeedDomainModel): Promise<RssfeedDto> => {
        return await this._feedRepo.update(id, model);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._feedRepo.delete(id);
    };

    addFeedItem = async (model: RssfeedItemDomainModel): Promise<RssfeedItemDto> => {
        return await this._feedItemRepo.create(model);
    };

    getFeedItemById = async (itemId: string) => {
        return await this._feedItemRepo.getById(itemId);
    };

    updateFeedItem = async (itemId: string, domainModel: RssfeedItemDomainModel): Promise<RssfeedItemDto> => {
        return await this._feedItemRepo.update(itemId, domainModel);
    };

    deleteFeedItem = async (itemId: string): Promise<boolean> => {
        return await this._feedItemRepo.delete(itemId);
    };

}
