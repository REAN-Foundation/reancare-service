import { INewsfeedRepo } from "../../database/repository.interfaces/general/newsfeed.repo.interface";
import { NewsfeedDto } from "../../domain.types/general/newsfeed/newsfeed.dto";
import { NewsfeedDomainModel } from "../../domain.types/general/newsfeed/newsfeed.domain.model";
import { NewsfeedSearchResults } from "../../domain.types/general/newsfeed/newsfeed.search.types";
import { NewsfeedSearchFilters } from "../../domain.types/general/newsfeed/newsfeed.search.types";
import { inject, injectable } from "tsyringe";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class NewsfeedService {

    constructor(
        @inject('INewsfeedRepo') private _newsfeedRepo: INewsfeedRepo,
    ) {}

    create = async (newsfeedDomainModel: NewsfeedDomainModel ): Promise<NewsfeedDto> => {
        return await this._newsfeedRepo.create(newsfeedDomainModel);
    };

    getById = async (id: string): Promise<NewsfeedDto> => {
        return await this._newsfeedRepo.getById(id);
    };

    markAsRead = async (id: string, newsfeedDomainModel: NewsfeedDomainModel): Promise<NewsfeedDto> => {
        return await this._newsfeedRepo.markAsRead(id, newsfeedDomainModel);
    };

    search = async (filters: NewsfeedSearchFilters): Promise<NewsfeedSearchResults> => {
        return await this._newsfeedRepo.search(filters);
    };

    update = async (id: string, newsfeedDomainModel: NewsfeedDomainModel): Promise<NewsfeedDto> => {
        return await this._newsfeedRepo.update(id, newsfeedDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._newsfeedRepo.delete(id);
    };

}
