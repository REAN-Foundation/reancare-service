import { uuid } from "../../../domain.types/miscellaneous/system.types";
import { inject, injectable } from "tsyringe";
import { IPostnatalVisitRepo } from "../../../database/repository.interfaces/clinical/maternity/postnatal.visit.repo.interface";
import { PostnatalVisitDomainModel } from "../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.domain.model";
import { PostnatalVisitDto } from "../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.dto";
import { PostnatalVisitSearchFilters, PostnatalVisitSearchResults } from "../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.search type";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class PostnatalVisitService {

    constructor(
        @inject('IPostnatalVisitRepo') private _postnatalVisitRepo: IPostnatalVisitRepo,
    ) { }

    create = async (postnatalVisitDomainModel: PostnatalVisitDomainModel): Promise<PostnatalVisitDto> => {
        return await this._postnatalVisitRepo.create(postnatalVisitDomainModel);
    };

    getById = async (postnatalVisitId: uuid): Promise<PostnatalVisitDto> => {
        return await this._postnatalVisitRepo.getById(postnatalVisitId);
    };

    search = async (filters: PostnatalVisitSearchFilters): Promise<PostnatalVisitSearchResults> => {
        return await this._postnatalVisitRepo.search(filters);
    };

    update = async (postnatalVisitId: uuid, postnatalVisitDomainModel: PostnatalVisitDomainModel): Promise<PostnatalVisitDto> => {
        return await this._postnatalVisitRepo.update(postnatalVisitId, postnatalVisitDomainModel);
    };

    delete = async (postnatalVisitId: uuid): Promise<boolean> => {
        return await this._postnatalVisitRepo.delete(postnatalVisitId);
    };

}