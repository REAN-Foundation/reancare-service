import HealthReport from '../../../models/users/patient/health.report.model';
import { HealthReportSettingDto } from '../../../../../../domain.types/users/patient/health.report.setting/health.report.setting.dto';

///////////////////////////////////////////////////////////////////////////////////

export class HealthReportSettingMapper {

    static toDto = (healthReportSetting: HealthReport): HealthReportSettingDto => {

        if (healthReportSetting == null){
            return null;
        }

        const dto: HealthReportSettingDto = {
            id            : healthReportSetting.id,
            PatientUserId : healthReportSetting.PatientUserId,
            Preference    : JSON.parse(healthReportSetting.Preference),

        };

        return dto;
    };

}
