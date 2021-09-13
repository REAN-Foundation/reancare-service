import { HeartPointsDomainModel } from "../../../domain.types/daily.records/HeartPoints/heart.points.domain.model";
import { HeartPointsDto } from "../../../domain.types/daily.records/HeartPoints/heart.points.dto";
import { HeartPointsSearchFilters, HeartPointsSearchResults } from "../../../domain.types/daily.records/HeartPoints/heart.points.search.types";

export interface IHeartPointsRepo {

    create(heartPointsDomainModel: HeartPointsDomainModel): Promise<HeartPointsDto>;

    getById(id: string): Promise<HeartPointsDto>;

    search(filters: HeartPointsSearchFilters): Promise<HeartPointsSearchResults>;

    update(id: string, heartPointsDomainModel: HeartPointsDomainModel): Promise<HeartPointsDto>;

    delete(id: string): Promise<boolean>;

}
