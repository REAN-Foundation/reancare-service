import { inject, injectable } from "tsyringe";
import { Logger } from "../../common/logger";
import { IKnowledgeNuggetRepo } from "../../database/repository.interfaces/educational/knowledge.nugget.repo.interface";
import { KnowledgeNuggetDomainModel } from '../../domain.types/educational/knowledge.nugget/knowledge.nugget.domain.model';
import { KnowledgeNuggetDto } from '../../domain.types/educational/knowledge.nugget/knowledge.nugget.dto';
import { KnowledgeNuggetSearchFilters, KnowledgeNuggetSearchResults } from '../../domain.types/educational/knowledge.nugget/knowledge.nugget.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class KnowledgeNuggetService {

    constructor(
        @inject('IKnowledgeNuggetRepo') private _knowledgeNuggetRepo: IKnowledgeNuggetRepo,
    ) { }

    getTodaysTopic = async (patientUserId: string): Promise<KnowledgeNuggetDto> => {

        //patientUserId - Will be used in future to fetch patient specific topics
        //For now,just log
        Logger.instance().log(`Knowledge nugget fetched for patient with user-id ${patientUserId}.`);

        return await this._knowledgeNuggetRepo.getRandom();
    };

    create = async (knowledgeNuggetDomainModel: KnowledgeNuggetDomainModel):
    Promise<KnowledgeNuggetDto> => {
        return await this._knowledgeNuggetRepo.create(knowledgeNuggetDomainModel);
    };

    getById = async (id: string): Promise<KnowledgeNuggetDto> => {
        return await this._knowledgeNuggetRepo.getById(id);
    };

    search = async (filters: KnowledgeNuggetSearchFilters): Promise<KnowledgeNuggetSearchResults> => {
        return await this._knowledgeNuggetRepo.search(filters);
    };

    update = async (id: string, knowledgeNuggetDomainModel: KnowledgeNuggetDomainModel):
    Promise<KnowledgeNuggetDto> => {
        return await this._knowledgeNuggetRepo.update(id, knowledgeNuggetDomainModel);
    };

    delete = async (id: string): Promise<boolean> => {
        return await this._knowledgeNuggetRepo.delete(id);
    };

}
