import { ReportFrequency } from '../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';
import { BloodGlucoseDomainModel } from '../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.domain.model';
import { BloodGlucoseDto } from "../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.dto";
import { BloodGlucoseSearchFilters, BloodGlucoseSearchResults } from '../../../../domain.types/clinical/biometrics/blood.glucose/blood.glucose.search.types';
import { MostRecentActivityDto } from '../../../../domain.types/users/patient/activity.tracker/activity.tracker.dto';

export interface IBloodGlucoseRepo {

    create(bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto>;

    getById(id: string): Promise<BloodGlucoseDto>;

    search(filters: BloodGlucoseSearchFilters): Promise<BloodGlucoseSearchResults>;

    update(id: string, bloodGlucoseDomainModel: BloodGlucoseDomainModel): Promise<BloodGlucoseDto>;

    delete(id: string): Promise<boolean>;

    getStats(patientUserId: string, frequency: ReportFrequency): Promise<any>;

    getRecent(patientUserId: string): Promise<BloodGlucoseDto>;

    getAllUserResponsesBetween(patientUserId: string, dateFrom: Date, dateTo: Date): Promise<any[]>;

    getAllUserResponsesBefore(patientUserId: string, date: Date): Promise<any[]>;

    getMostRecentBloodGlucoseActivity(patientUserId: string): Promise<MostRecentActivityDto>;

    deleteByUserId(patientUserId: string, hardDelete: boolean): Promise<boolean>;
}
