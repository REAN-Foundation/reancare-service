import { BodyHeightDomainModel } from "../../../../domain.types/clinical/biometrics/body.height/body.height.domain.model";
import { BodyHeightDto } from "../../../../domain.types/clinical/biometrics/body.height/body.height.dto";
import { BodyHeightSearchFilters, BodyHeightSearchResults } from "../../../../domain.types/clinical/biometrics/body.height/body.height.search.types";

export interface IBodyHeightRepo {

    create(BodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto>;

    getById(id: string): Promise<BodyHeightDto>;

    search(filters: BodyHeightSearchFilters): Promise<BodyHeightSearchResults>;

    update(id: string, BodyHeightDomainModel: BodyHeightDomainModel): Promise<BodyHeightDto>;

    delete(id: string): Promise<boolean>;

    getRecent(patientUserId: string): Promise<BodyHeightDto>;

}
