import { HealthReportSettingDto } from '../../../../domain.types/users/patient/health.report.setting/health.report.setting.dto';
import { HealthReportSettingDomainModel } from '../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';

export interface IHealthReportSettingRepo {

    create(entity: HealthReportSettingDomainModel): Promise<HealthReportSettingDto>;

    getByUserId(userId: string): Promise<HealthReportSettingDto>;

    updateByUserId(userId: string, updateModel: HealthReportSettingDomainModel): Promise<HealthReportSettingDto>;

}
