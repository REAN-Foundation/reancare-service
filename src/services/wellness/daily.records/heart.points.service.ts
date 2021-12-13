import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IHeartPointsRepo } from "../../../database/repository.interfaces/wellness/daily.records/heart.points.repo.interface";
import { HeartPointsDomainModel } from '../../../domain.types/wellness/daily.records/heart.points/heart.points.domain.model';
import { HeartPointsDto } from '../../../domain.types/wellness/daily.records/heart.points/heart.points.dto';
import { HeartPointsSearchFilters, HeartPointsSearchResults } from '../../../domain.types/wellness/daily.records/heart.points/heart.points.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HeartPointsService {

    constructor(
        @inject('IHeartPointsRepo') private _heartPointRepo: IHeartPointsRepo,
    ) {}

    create = async (heartPointDomainModel: HeartPointsDomainModel): Promise<HeartPointsDto> => {
        return await this._heartPointRepo.create(heartPointDomainModel);
    };

    getById = async (id: uuid): Promise<HeartPointsDto> => {
        return await this._heartPointRepo.getById(id);
    };

    search = async (filters: HeartPointsSearchFilters): Promise<HeartPointsSearchResults> => {
        return await this._heartPointRepo.search(filters);
    };

    update = async (id: uuid, heartPointDomainModel: HeartPointsDomainModel): Promise<HeartPointsDto> => {
        return await this._heartPointRepo.update(id, heartPointDomainModel);
    };

    delete = async (id: uuid): Promise<boolean> => {
        return await this._heartPointRepo.delete(id);
    };

}
