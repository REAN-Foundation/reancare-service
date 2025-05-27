import { ReportFrequency } from "../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model";
import { BodyWeightDomainModel } from "../../../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model";
import { BodyWeightDto } from "../../../../domain.types/clinical/biometrics/body.weight/body.weight.dto";
import { BodyWeightSearchFilters, BodyWeightSearchResults } from "../../../../domain.types/clinical/biometrics/body.weight/body.weight.search.types";
import { MostRecentActivityDto } from "../../../../domain.types/users/patient/activity.tracker/activity.tracker.dto";

export interface IBodyWeightRepo {

    create(bodyWeightDomainModel: BodyWeightDomainModel): Promise<BodyWeightDto>;

    getById(id: string): Promise<BodyWeightDto>;

    search(filters: BodyWeightSearchFilters): Promise<BodyWeightSearchResults>;

    update(id: string, bodyWeightDomainModel: BodyWeightDomainModel): Promise<BodyWeightDto>;

    delete(id: string): Promise<boolean>;

    getStats(patientUserId: string, frequency: ReportFrequency): Promise<any>;

    getRecent(patientUserId: string): Promise<BodyWeightDto>;

    getAllUserResponsesBetween(patientUserId: string, dateFrom: Date, dateTo: Date): Promise<any[]>;

    getAllUserResponsesBefore(patientUserId: string, date: Date): Promise<any[]>;

    getMostRecentBodyWeightActivity(patientUserId: string): Promise<MostRecentActivityDto>;

    deleteByUserId(patientUserId: string, hardDelete: boolean): Promise<boolean>;
}
