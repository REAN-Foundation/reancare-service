import { injectable } from "tsyringe";
import { Logger } from "../../../common/logger";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { Loader } from "../../../startup/loader";
import { FoodConsumptionService } from "../../../services/wellness/nutrition/food.consumption.service";
import { Injector } from "../../../startup/injector";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { FoodConsumptionDto } from "../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto";
import Patient from "src/database/sql/sequelize/models/users/patient/patient.model";
import { PatientAppNameCache } from "../patient.appname.cache";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRNutritionService {

    _ehrAnalyticsHandler: EHRAnalyticsHandler = new EHRAnalyticsHandler();

    _foodConsumptionService: FoodConsumptionService = Injector.Container.resolve(FoodConsumptionService);

    public scheduleExistingNutritionDataToEHR = async () => {
        try {

            var moreItems = true;
            var pageIndex = 0;
            while (moreItems) {
                var filters = {
                    PageIndex    : pageIndex,
                    ItemsPerPage : 1000,
                };

                var searchResults = null;
                
                searchResults = await this._foodConsumptionService.search(filters);
                for await (var r of searchResults.Items) {
                    await this.addEHRRecordNutritionForAppNames(r);     
                }
                
                pageIndex++;
                Logger.instance().log(`[ScheduleExistingNutritionDataToEHR] Processed :${searchResults.Items.length} records for Nutrition`);

                if (searchResults.Items.length < 1000) {
                    moreItems = false;
                }

            }
            
        }
        catch (error) {
            Logger.instance().log(`[ScheduleExistingNutritionDataToEHR] Error population existing nutrition data in ehr insights database: ${JSON.stringify(error)}`);
        }
    };

    
    public addEHRRecord = (model: FoodConsumptionDto, appName?: string) => {
        if (model.FoodTypes[0] === "GenericNutrition") {
            EHRAnalyticsHandler.addBooleanRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                model.UserResponse,
                null,
                null,
                'Were most of your food choices healthy today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Fruit") {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of fruit did you eat today?',
                'How many servings of fruit did you eat today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Vegetables") {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of vegetables did you eat today?',
                'How many servings of vegetables did you eat today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Sugary drinks") {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of sugary drinks did you drink today?',
                'How many servings of sugary drinks did you drink today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Salt") {
            EHRAnalyticsHandler.addBooleanRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                model.UserResponse,
                model.ServingUnit,
                'Did you choose or prepare foods with little or no salt today?',
                'Did you choose or prepare foods with little or no salt today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null

            );
        }
        if (model.FoodTypes[0] === "Sea food") {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of fish or shellfish/seafood did you eat today?',
                'How many servings of fish or shellfish/seafood did you eat today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null

            );
        }
        if (model.FoodTypes[0] === "Grains") {
            EHRAnalyticsHandler.addFloatRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                model.Servings,
                model.ServingUnit,
                'How many servings of whole grains do you consume per day?',
                'How many servings of whole grains do you consume per day?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null

            );
        }
        if (model.FoodTypes[0] === "Protein") {
            EHRAnalyticsHandler.addBooleanRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                model.UserResponse,
                model.ServingUnit,
                'Did you select healthy sources of protein today?',
                'Did you select healthy sources of protein today?',
                appName,
                model.CreatedAt ? new Date(model.CreatedAt) : null

            );
        }

    };

    public addEHRRecordNutritionForAppNames = async (model: FoodConsumptionDto, appName?: string) => {
        const eligibleAppNames = await PatientAppNameCache.get(model.PatientUserId);
        for (var appName of eligibleAppNames) {
            this.addEHRRecord(model, appName);
        }
    };

}
