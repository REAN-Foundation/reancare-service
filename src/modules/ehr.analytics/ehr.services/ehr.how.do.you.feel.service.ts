import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { Injector } from "../../../startup/injector";
import { PatientAppNameCache } from "../patient.appname.cache";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { HowDoYouFeelService } from "../../../services/clinical/symptom/how.do.you.feel.service";
import { HowDoYouFeelDto } from "../../../domain.types/clinical/symptom/how.do.you.feel/how.do.you.feel.dto";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRHowDoYouFeelService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _howDoYouFeelService: HowDoYouFeelService = Injector.Container.resolve(HowDoYouFeelService);

    private addEHRRecord = (
        model: HowDoYouFeelDto,
        appName?: string) => {

        if (model.Feeling === '1') {
            EHRAnalyticsHandler.addStringRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                model.Feeling,
                null,
                'Better',
                null,
                appName
            );
        }

        if (model.Feeling === '0') {
            EHRAnalyticsHandler.addStringRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                model.Feeling,
                null,
                'Same',
                appName
            );
        }

        if (model.Feeling === '-1') {
            EHRAnalyticsHandler.addStringRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.Symptom,
                model.Feeling,
                null,
                'Worse',
                appName
            );
        }
    };

    public async addEHRHowDoYouFeelForAppNames(r: HowDoYouFeelDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) { 
            this.addEHRRecord(r, appName);
        }
    }

}
