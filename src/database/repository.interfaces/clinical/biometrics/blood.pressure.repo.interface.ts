
import { ReportFrequency } from "../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model";
import { BloodPressureDomainModel } from "../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.domain.model";
import { BloodPressureDto } from "../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.dto";
import { BloodPressureSearchFilters, BloodPressureSearchResults } from "../../../../domain.types/clinical/biometrics/blood.pressure/blood.pressure.search.types";
import { MostRecentActivityDto } from "../../../../domain.types/users/patient/activity.tracker/activity.tracker.dto";

export interface IBloodPressureRepo {

    create(bloodPressureDomainModel: BloodPressureDomainModel): Promise<BloodPressureDto>;

    getById(id: string): Promise<BloodPressureDto>;

    search(filters: BloodPressureSearchFilters): Promise<BloodPressureSearchResults>;

    update(id: string, bloodPressureDomainModel: BloodPressureDomainModel):
    Promise<BloodPressureDto>;

    delete(id: string): Promise<boolean>;

    getStats(patientUserId: string, frequency: ReportFrequency): Promise<any>;

    getRecent(patientUserId: string): Promise<BloodPressureDto>;

    getAllUserResponsesBetween(patientUserId: string, dateFrom: Date, dateTo: Date): Promise<any[]>;

    getAllUserResponsesBefore(patientUserId: string, date: Date): Promise<any[]>;

    getMostRecentBloodPressureActivity(patientUserId: string): Promise<MostRecentActivityDto>;

    deleteByUserId(patientUserId: string, hardDelete: boolean): Promise<boolean>;
}
