import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { AntenatalVisitDomainModel } from "../../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.domain.type";
import { AntenatalVisitDto } from "../../../../domain.types/clinical/maternity/antenatal.visit/antenatal.visit.dto";

export interface IAntenatalVisitRepo {

    create(visitDomainModel: AntenatalVisitDomainModel): Promise<AntenatalVisitDto>;

    getById(antenatalVisitId: string): Promise<AntenatalVisitDto>;

    update(antenatalVisitId: string, visitDomainModel: AntenatalVisitDomainModel): Promise<AntenatalVisitDto>;

    delete(antenatalVisitId: string): Promise<boolean>;
}
