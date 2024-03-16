import { inject, injectable } from 'tsyringe';
import { HealthReportSettingsDomainModel } from '../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';
import { IHealthReportSettingsRepo } from '../../../database/repository.interfaces/users/patient/health.report.setting.repo.interface';
import { HealthReportSettingsDto } from '../../../domain.types/users/patient/health.report.setting/health.report.setting.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HealthReportSettingService {

    constructor(
       @inject('IHealthReportSettingsRepo') private _healthReportSettingRepo: IHealthReportSettingsRepo,

    ) {}

    //#region Public

    public create = async (healthReportSettingDomainModel: HealthReportSettingsDomainModel):
     Promise<HealthReportSettingsDto> => {
        return this._healthReportSettingRepo.create(healthReportSettingDomainModel);
    };

    public getByUserId = async (id: string): Promise<HealthReportSettingsDto> => {
        return await this._healthReportSettingRepo.getByUserId(id);
    };

    public updateByUserId = async (id: string, model: HealthReportSettingsDomainModel):
     Promise<HealthReportSettingsDto> => {
        return await this._healthReportSettingRepo.updateByUserId(id, model);
    };

    //#endregion

}
