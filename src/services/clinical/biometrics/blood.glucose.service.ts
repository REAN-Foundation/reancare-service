import { BloodGlucoseStore } from "../../../modules/ehr/services/blood.glucose.store";
import { inject, injectable } from "tsyringe";
import { IBloodGlucoseRepo } from "../../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { BloodGlucoseDomainModel } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseDto } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto';
import { BloodGlucoseSearchFilters, BloodGlucoseSearchResults } from '../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.search.types';
import { ConfigurationManager } from "../../../config/configuration.manager";
import { Injector } from "../../../startup/injector";
import { MostRecentActivityDto } from "../../../domain.types/users/patient/activity.tracker/activity.tracker.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class BloodGlucoseService {

    _ehrBloodGlucoseStore: BloodGlucoseStore = null;

    constructor(
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrBloodGlucoseStore = Injector.Container.resolve(BloodGlucoseStore);
        }
    }

    create = async (bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto> => {

        if (this._ehrBloodGlucoseStore) {
            const ehrId = await this._ehrBloodGlucoseStore.add(bloodGlucoseDomainModel);
            bloodGlucoseDomainModel.EhrId = ehrId;
        }

        var dto = await this._bloodGlucoseRepo.create(bloodGlucoseDomainModel);
        return dto;
    };

    getById = async (id: string): Promise<BloodGlucoseDto> => {
        return await this._bloodGlucoseRepo.getById(id);
    };

    update = async (id: string, bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto> => {
        var dto = await this._bloodGlucoseRepo.update(id, bloodGlucoseDomainModel);
        if (this._ehrBloodGlucoseStore) {
            await this._ehrBloodGlucoseStore.update(dto.EhrId, dto);
        }
        return dto;
    };

    search = async (filters: BloodGlucoseSearchFilters): Promise<BloodGlucoseSearchResults> => {
        return await this._bloodGlucoseRepo.search(filters);

    };

    delete = async (id: string): Promise<boolean> => {
        return await this._bloodGlucoseRepo.delete(id);
    };

    getAllUserResponsesBetween = async (patientUserId: string, dateFrom: Date, dateTo: Date)
        : Promise<any[]> => {
        return await this._bloodGlucoseRepo.getAllUserResponsesBetween(patientUserId, dateFrom, dateTo);
    };

    getAllUserResponsesBefore = async (patientUserId: string, date: Date)
        : Promise<any[]> => {
        return await this._bloodGlucoseRepo.getAllUserResponsesBefore(patientUserId, date);
    };

    getMostRecentBloodGlucoseActivity = async (patientUserId: string): Promise<MostRecentActivityDto> => {
        return await this._bloodGlucoseRepo.getMostRecentBloodGlucoseActivity(patientUserId);
    };

    deleteByUserId = async (patientUserId: string, hardDelete: boolean = true): Promise<boolean> => {
        return await this._bloodGlucoseRepo.deleteByUserId(patientUserId, hardDelete);
    };

}
