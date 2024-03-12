import { HealthReportSettingDomainModel } from '../../../../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';
import { ApiError } from '../../../../../../common/api.error';
import { Logger } from '../../../../../../common/logger';
import HealthReport from '../../../models/users/patient/health.report.model';
import { HealthReportSettingMapper } from '../../../mappers/users/patient/health.report.setting.mapper';
import { IHealthReportSettingRepo } from '../../../../../../database/repository.interfaces/users/patient/health.report.setting.repo.interface';

///////////////////////////////////////////////////////////////////////

export class HealthReportSettingRepo implements IHealthReportSettingRepo{

    create = async (model: HealthReportSettingDomainModel)
    : Promise<HealthReportSettingDomainModel> => {
        try {
            const entity = {
                PatientUserId : model.PatientUserId,
                Preference    : JSON.stringify(model.Preference)
            };
            const healthReportSetting = await HealthReport.create(entity);
            return HealthReportSettingMapper.toDto(healthReportSetting);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    getByUserId = async (patientUserId: string): Promise<HealthReportSettingDomainModel> => {
        try {
            const healthReportSetting = await HealthReport.findOne({
                where : {
                    PatientUserId : patientUserId
                }
            });
            return HealthReportSettingMapper.toDto(healthReportSetting);
        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

    updateByUserId = async (
        patientUserId: string,
        model: HealthReportSettingDomainModel)
        : Promise<HealthReportSettingDomainModel> => {

        try {
            const healthReportSetting = await HealthReport.findOne({
                where : {
                    PatientUserId : patientUserId
                }
            });
            if (healthReportSetting == null) {
                throw new Error("Cannot find health report settings for the patient.");
            }
            
            healthReportSetting.Preference = JSON.stringify(model.Preference);
            await healthReportSetting.save();

            return HealthReportSettingMapper.toDto(healthReportSetting);

        } catch (error) {
            Logger.instance().log(error.message);
            throw new ApiError(500, error.message);
        }
    };

}
