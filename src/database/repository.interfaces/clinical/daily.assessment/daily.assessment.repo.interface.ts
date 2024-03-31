import { ReportFrequency } from "../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model";
import { DailyAssessmentDomainModel } from "../../../../domain.types/clinical/daily.assessment/daily.assessment.domain.model";
import { DailyAssessmentDto } from "../../../../domain.types/clinical/daily.assessment/daily.assessment.dto";
import { DailyAssessmentSearchFilters, DailyAssessmentSearchResults } from "../../../../domain.types/clinical/daily.assessment/daily.assessment.search.types";

export interface IDailyAssessmentRepo {

    create(dailyAssessmentDomainModel: DailyAssessmentDomainModel): Promise<DailyAssessmentDto>;

    search(filters: DailyAssessmentSearchFilters): Promise<DailyAssessmentSearchResults>;

    getStats(patientUserId: string, frequency: ReportFrequency): Promise<any>;

}
