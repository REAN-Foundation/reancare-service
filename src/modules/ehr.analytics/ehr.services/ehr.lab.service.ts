import { injectable } from 'tsyringe';
import { Logger } from '../../../common/logger';
import { EHRAnalyticsHandler } from '../ehr.analytics.handler';
import EHRLabData from '../models/ehr.lab.data.model';
import { LabRecordDto } from '../../../domain.types/clinical/lab.record/lab.record/lab.record.dto';
import { EHRRecordTypes } from '../ehr.domain.models/ehr.record.types';
import { PatientAppNameCache } from '../patient.appname.cache';

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRLabService {

    public deleteLabEHRRecord = async (id: string) => {
        try {
            const result = await EHRLabData.destroy({ where: { RecordId: id } });
            Logger.instance().log(`EHR lab record deleted : ${JSON.stringify(result)}`);
        } catch (error) {
            Logger.instance().log(error.message);
        }
    };

    public addEHRRecord = (model: LabRecordDto, appName?: string) => {
        if (model) {
            EHRAnalyticsHandler.addIntegerRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.LabRecord,
                model.PrimaryValue,
                model.Unit,
                model.DisplayName,
                model.DisplayName,
                appName,
                model.RecordedAt ? model.RecordedAt : null
            );
        }
    };

    public async addEHRLabRecordForAppNames(r: LabRecordDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) {
            this.addEHRRecord(r, appName);
        }
    }

}
