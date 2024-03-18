import { inject, injectable } from 'tsyringe';
import { HealthReportSettingDomainModel } from '../../../domain.types/users/patient/health.report.setting/health.report.setting.domain.model';
import { IHealthReportSettingRepo } from '../../../database/repository.interfaces/users/patient/health.report.setting.repo.interface';
import { HealthReportSettingDto } from '../../../domain.types/users/patient/health.report.setting/health.report.setting.dto';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class HealthReportSettingService {

    constructor(
       @inject('IHealthReportSettingRepo') private _healthReportSettingRepo: IHealthReportSettingRepo,

    ) {}

    //#region Public

    public create = async (healthReportSettingDomainModel: HealthReportSettingDomainModel):
     Promise<HealthReportSettingDto> => {
        return this._healthReportSettingRepo.create(healthReportSettingDomainModel);
    };

    public getByUserId = async (id: string): Promise<HealthReportSettingDto> => {
        return await this._healthReportSettingRepo.getByUserId(id);
    };

    public updateByUserId = async (id: string, model: HealthReportSettingDomainModel):
     Promise<HealthReportSettingDto> => {
        return await this._healthReportSettingRepo.updateByUserId(id, model);
    };

    //#endregion

}
