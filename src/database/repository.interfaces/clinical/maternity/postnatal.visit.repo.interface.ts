import { PostnatalVisitDomainModel } from "../../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.domain.model";
import { PostnatalVisitDto } from "../../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.dto";
import { PostnatalVisitSearchFilters, PostnatalVisitSearchResults } from "../../../../domain.types/clinical/maternity/postnatal.visit/postnatal.visit.search type";

export interface IPostnatalVisitRepo {

    create(postnatalVisitDomainModel: PostnatalVisitDomainModel): Promise<PostnatalVisitDto>;

    getById(postnatalVisitId: string): Promise<PostnatalVisitDto>;

    search(filters: PostnatalVisitSearchFilters): Promise<PostnatalVisitSearchResults>;

    update(id: string, postnatalVisitDomainModel: PostnatalVisitDomainModel): Promise<PostnatalVisitDto>;

    delete(id: string): Promise<boolean>;

}
