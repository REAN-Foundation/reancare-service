import { injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { SleepService } from "../../../services/wellness/daily.records/sleep.service";
import { MeditationService } from "../../../services/wellness/exercise/meditation.service";
import { Injector } from "../../../startup/injector";
import { SleepDto } from "../../../domain.types/wellness/daily.records/sleep/sleep.dto";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { MeditationDto } from "../../../domain.types/wellness/exercise/meditation/meditation.dto";
import { PatientAppNameCache } from "../patient.appname.cache";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRMentalWellBeingService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _sleepService: SleepService = Injector.Container.resolve(SleepService);

    _meditationService: MeditationService = Injector.Container.resolve(MeditationService);

    public scheduleExistingMentalWellBeingDataToEHR = async (model : string) => {
        try {

            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                switch (model) {
                        case "Sleep" :
                            searchResults = await this._sleepService.search(filters);
                            for await (var r of searchResults.Items) {
                                await this.addEHRSleepForAppNames(r);    
                            }
                        break;

                        case "Meditation" :
                            searchResults = await this._meditationService.search(filters);
                            for await (var r of searchResults.Items) {
                                await this.addEHRMeditationForAppNames(r);     
                            }
                        break;     
                    
                }
                pageIndex++;
                Logger.instance().log(`[ScheduleExistingMentalWellBeingDataToEHR] Processed :${searchResults.Items.length} records for ${model}`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
        }
        catch (error) {
            Logger.instance().log(`[ScheduleExistingMentalWellBeingDataToEHR] Error population existing data in ehr insights database: ${JSON.stringify(error)}`);
        }
    };

    public addEHRRecordSleep = async (model: SleepDto, appName?: string) => {
        if (model.SleepDuration) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.MentalWellBeing,
                model.SleepDuration,
                model.Unit,
                'Sleep',
                null,
                appName,
                model.RecordDate ? model.RecordDate : null
            );
        }
    };

    public addEHRRecordMeditation = async (model: MeditationDto, appName?: string) => {
        if (model.DurationInMins) {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                null,
                EHRRecordTypes.MentalWellBeing,
                model.DurationInMins,
                'mins',
                'Meditation',
                null,
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
    };

    public async addEHRSleepForAppNames(r: SleepDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) { 
            this.addEHRRecordSleep(r, appName);
        }
    }

    public async addEHRMeditationForAppNames(r: MeditationDto) {
        const eligibleAppNames = await PatientAppNameCache.get(r.PatientUserId);
        for (var appName of eligibleAppNames) { 
            this.addEHRRecordMeditation(r, appName);
        }
    }

}
