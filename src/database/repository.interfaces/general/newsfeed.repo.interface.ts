import { NewsfeedDomainModel } from "../../../domain.types/general/newsfeed/newsfeed.domain.model";
import { NewsfeedDto } from "../../../domain.types/general/newsfeed/newsfeed.dto";
import { NewsfeedSearchResults } from "../../../domain.types/general/newsfeed/newsfeed.search.types";
import { NewsfeedSearchFilters } from "../../../domain.types/general/newsfeed/newsfeed.search.types";

export interface INewsfeedRepo {

    create(newsfeedDomainModel: NewsfeedDomainModel): Promise<NewsfeedDto>;

    getById(id: string): Promise<NewsfeedDto>;

    markAsRead(id: string, newsfeedDomainModel: NewsfeedDomainModel): Promise<NewsfeedDto>;

    search(filters: NewsfeedSearchFilters): Promise<NewsfeedSearchResults>;

    update(id: string, newsfeedDomainModel: NewsfeedDomainModel): Promise<NewsfeedDto>;

    delete(id: string): Promise<boolean>;

}
