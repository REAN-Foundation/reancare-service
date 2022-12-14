import { IRssfeedRepo } from "../../database/repository.interfaces/general/rss.feed/rss.feed.repo.interface";
import { RssfeedDto, RssfeedItemDto } from "../../domain.types/general/rss.feed/rss.feed.dto";
import { RssfeedDomainModel, RssfeedItemDomainModel } from "../../domain.types/general/rss.feed/rss.feed.domain.model";
import { RssfeedSearchResults } from "../../domain.types/general/rss.feed/rssfeed.search.types";
import { RssfeedSearchFilters } from "../../domain.types/general/rss.feed/rssfeed.search.types";
import { inject, injectable } from "tsyringe";
import { IRssfeedItemRepo } from "../../database/repository.interfaces/general/rss.feed/rss.feed.item.repo.interface";
import { uuid } from "../../domain.types/miscellaneous/system.types";
import { Feed, FeedOptions } from "feed";
import { Helper } from "../../common/helper";
import { TimeHelper } from "../../common/time.helper";
import { FileResourceService } from "./file.resource.service";
import { Loader } from "../../startup/loader";
import { ConfigurationManager } from "../../config/configuration.manager";

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

    getById = async (id: uuid): Promise<RssfeedDto> => {
        return await this._feedRepo.getById(id);
    };

    search = async (filters: RssfeedSearchFilters): Promise<RssfeedSearchResults> => {
        return await this._feedRepo.search(filters);
    };

    update = async (id: uuid, model: RssfeedDomainModel): Promise<RssfeedDto> => {
        return await this._feedRepo.update(id, model);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._feedRepo.delete(id);
    };

    addFeedItem = async (model: RssfeedItemDomainModel): Promise<RssfeedItemDto> => {
        return await this._feedItemRepo.create(model);
    };

    getFeedItemById = async (itemId: uuid) => {
        return await this._feedItemRepo.getById(itemId);
    };

    updateFeedItem = async (itemId: uuid, domainModel: RssfeedItemDomainModel): Promise<RssfeedItemDto> => {
        return await this._feedItemRepo.update(itemId, domainModel);
    };

    deleteFeedItem = async (itemId: uuid): Promise<boolean> => {
        return await this._feedItemRepo.delete(itemId);
    };

    createOrUpdateFeed = async (id: uuid): Promise<{ atomFeedLink: string; jsonFeedLink: string; rssFeedLink: string}> => {

        const _id = Helper.generateDisplayCode();
        const record = await this._feedRepo.getById(id);
        const obj: FeedOptions = {
            title     : record.Title,
            id        : record.Link ?? _id,
            copyright : record.Copyright ?? "© 2022, REAN Foundation, All rights reserved."
        };
        if (record.Description) {
            obj['description'] = record.Description;
        }
        if (record.Link) {
            obj['link'] = record.Link;
        }
        if (record.Language) {
            obj['language'] = record.Language;
        }
        if (record.Image) {
            obj['image'] = record.Image;
        }
        if (record.Favicon) {
            obj['favicon'] = record.Favicon;
        }
        if (record.Copyright) {
            obj['copyright'] = record.Copyright;
        }
        if (record.Updated) {
            obj['updated'] = record.Updated;
        }
        obj['feedLinks'] = {
            json : record.AtomFeedLink ?? "",
            atom : record.JsonFeedLink ?? ""
        };
        obj['author'] = {
            name  : record.ProviderName ?? "",
            email : record.ProviderEmail ?? "",
            link  : record.ProviderLink ?? ""
        };

        const feed = new Feed(obj);

        feed.addCategory(record.Category ?? "General");
          
        const rssFeed_ = feed.rss2(); //RSS 2.0
        const atomFeed_ = feed.atom1(); //Atom 1.0
        const jsonFeed_ = feed.json1(); //JSON Feed 1.0

        const rssFeedResource = await this.getFileResource(rssFeed_, 'rss', '.rss');
        const atomFeedResource = await this.getFileResource(atomFeed_, 'atom', '.atom');
        const jsonFeedResource = await this.getFileResource(jsonFeed_, 'json', '.json');

        const updates = {
            AtomFeedResourceId : atomFeedResource.id,
            RssFeedResourceId  : rssFeedResource.id,
            JsonFeedResourceId : jsonFeedResource.id,
        };

        const updated = await this._feedRepo.update(id, updates);

        const atomFeedLink = atomFeedResource.Url; 
        const jsonFeedLink = jsonFeedResource.Url;
        const rssFeedLink = rssFeedResource.Url;

        return { atomFeedLink, jsonFeedLink, rssFeedLink };
    }

    getFileResource = async (text: string, prefix = 'atom|rss|json', extension = '.atom|.rss|.json') => {
        const frService = Loader.container.resolve(FileResourceService);
        const timestamp = TimeHelper.timestamp(new Date());
        const filename = prefix + '_' + timestamp + extension;
        const systemIdentifier = ConfigurationManager.SystemIdentifier();
        var cloudStoragePath = `rss-feeds/${systemIdentifier}/` + filename;
        const localPath = await Helper.writeTextToFile(text, filename);
        const resource = frService.uploadLocal(localPath, cloudStoragePath, true);
        return resource;
    }

}
