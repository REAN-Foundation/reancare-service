import { inject, injectable } from "tsyringe";
import { IKnowledgeNuggetRepo } from "../../database/repository.interfaces/static.types/knowledge.nugget.repo.interface";
import { KnowledgeNuggetDomainModel } from '../../domain.types/static.types/knowledge.nugget/knowledge.nugget.domain.model';
import { KnowledgeNuggetDto } from '../../domain.types/static.types/knowledge.nugget/knowledge.nugget.dto';
import { KnowledgeNuggetSearchResults, KnowledgeNuggetSearchFilters } from '../../domain.types/static.types/knowledge.nugget/knowledge.nugget.search.types';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class KnowledgeNuggetService {

    constructor(
        @inject('IKnowledgeNuggetRepo') private _knowledgeNuggetRepo: IKnowledgeNuggetRepo,
    ) { }

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

