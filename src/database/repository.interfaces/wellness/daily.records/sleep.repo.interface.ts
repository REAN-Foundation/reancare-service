
import { ReportFrequency } from "../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model";
import { uuid } from "../../../../domain.types/miscellaneous/system.types";
import { SleepDomainModel } from "../../../../domain.types/wellness/daily.records/sleep/sleep.domain.model";
import { SleepDto } from "../../../../domain.types/wellness/daily.records/sleep/sleep.dto";
import { SleepSearchFilters, SleepSearchResults } from "../../../../domain.types/wellness/daily.records/sleep/sleep.search.types";

////////////////////////////////////////////////////////////////////////////////////////////////

export interface ISleepRepo {

    create(sleepDomainModel: SleepDomainModel): Promise<SleepDto>;

    getById(id: uuid): Promise<SleepDto>;

    getByRecordDate(date: Date, patientUserId: uuid): Promise<SleepDto>;

    search(filters: SleepSearchFilters): Promise<SleepSearchResults>;

    update(id: uuid, sleepDomainModel: SleepDomainModel): Promise<SleepDto>;

    delete(id: uuid): Promise<boolean>;

    getStats(patientUserId: string, frequency: ReportFrequency): Promise<any>;

    getByRecordDateAndPatientUserId(recordDate: Date, patientUserId: string): Promise<SleepDto>;

    getAllUserResponsesBetween(patientUserId: string, dateFrom: Date, dateTo: Date): Promise<any[]>;

    getAllUserResponsesBefore(patientUserId: string, date: Date): Promise<any[]>;

}
