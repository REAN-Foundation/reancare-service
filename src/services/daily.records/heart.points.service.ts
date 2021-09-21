import { inject, injectable } from "tsyringe";
import { IHeartPointsRepo } from "../../database/repository.interfaces/daily.records/heart.points.repo.interface";
import { HeartPointsDomainModel } from '../../domain.types/daily.records/heart.points/heart.points.domain.model';
import { HeartPointsDto } from '../../domain.types/daily.records/heart.points/heart.points.dto';
import { HeartPointsSearchFilters, HeartPointsSearchResults } from '../../domain.types/daily.records/heart.points/heart.points.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HeartPointsService {

    constructor(
        @inject('IHeartPointsRepo') private _heartPointRepo: IHeartPointsRepo,
    ) {}

    create = async (heartPointDomainModel: HeartPointsDomainModel): Promise<HeartPointsDto> => {
        return await this._heartPointRepo.create(heartPointDomainModel);
    };

    getById = async (id: string): Promise<HeartPointsDto> => {
        return await this._heartPointRepo.getById(id);
    };

    search = async (filters: HeartPointsSearchFilters): Promise<HeartPointsSearchResults> => {
        return await this._heartPointRepo.search(filters);
    };

    update = async (id: string, heartPointDomainModel: HeartPointsDomainModel): Promise<HeartPointsDto> => {
        return await this._heartPointRepo.update(id, heartPointDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._heartPointRepo.delete(id);
    };

}
