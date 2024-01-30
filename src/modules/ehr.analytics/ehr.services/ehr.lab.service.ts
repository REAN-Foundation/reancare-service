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

    public addEHRRecord = (model: LabRecordDto, appNames?: string) => {
        if (model.DisplayName === "Total Cholesterol") {
            EHRAnalyticsHandler.addLabRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.LabRecord,
                model.PrimaryValue,
                null,
                null,
                null,
                null,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordedAt ? model.RecordedAt : null
            );
        }

        if (model.DisplayName === "HDL") {
            EHRAnalyticsHandler.addLabRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.LabRecord,
                null,
                model.PrimaryValue,
                null,
                null,
                null,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordedAt ? model.RecordedAt : null
            );
        }
        if (model.DisplayName === "LDL") {
            EHRAnalyticsHandler.addLabRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.LabRecord,
                null,
                null,
                model.PrimaryValue,
                null,
                null,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordedAt ? model.RecordedAt : null
            );
        }
        if (model.DisplayName === "Lipoprotein") {
            EHRAnalyticsHandler.addLabRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.LabRecord,
                null,
                null,
                null,
                model.PrimaryValue,
                null,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordedAt ? model.RecordedAt : null
            );
        }
        if (model.DisplayName === "A1C Level") {
            EHRAnalyticsHandler.addLabRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.LabRecord,
                null,
                null,
                null,
                null,
                model.PrimaryValue,
                null,
                null,
                model.Unit,
                appNames,
                model.RecordedAt ? model.RecordedAt : null
            );
        }
        if (model.DisplayName === "Triglyceride Level") {
            EHRAnalyticsHandler.addLabRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.LabRecord,
                null,
                null,
                null,
                null,
                null,
                model.PrimaryValue,
                null,
                model.Unit,
                appNames,
                model.RecordedAt ? model.RecordedAt : null
            );
        }
        if (model.DisplayName === "Cholesterol Ratio") {
            EHRAnalyticsHandler.addLabRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.LabRecord,
                null,
                null,
                null,
                null,
                null,
                null,
                model.PrimaryValue,
                model.Unit,
                appNames,
                model.RecordedAt ? model.RecordedAt : null
            );
        }
    };

    public async addEHRLabRecordForAppNames(r: LabRecordDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecord(r, JSON.stringify(appNames));
    }

}
