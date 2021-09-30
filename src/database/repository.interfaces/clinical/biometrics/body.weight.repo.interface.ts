import { BodyWeightDomainModel } from "../../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model";
import { BodyWeightDto } from "../../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { BodyWeightSearchFilters, BodyWeightSearchResults } from "../../../../domain.types/clinical/biometrics/body.weight/body.weight.search.types";

export interface IBodyWeightRepo {

    create(bodyWeightDomainModel: BodyWeightDomainModel): Promise<BodyWeightDto>;

    getById(id: string): Promise<BodyWeightDto>;

    getByPatientUserId(patientUserId: string): Promise<BodyWeightDto[]>;

    search(filters: BodyWeightSearchFilters): Promise<BodyWeightSearchResults>;

    update(id: string, bodyWeightDomainModel: BodyWeightDomainModel): Promise<BodyWeightDto>;

    delete(id: string): Promise<boolean>;

}
