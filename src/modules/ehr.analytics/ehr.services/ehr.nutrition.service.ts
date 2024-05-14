import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { FoodConsumptionDto } from "../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto";
import { PatientAppNameCache } from "../patient.appname.cache";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRNutritionService {

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

    public addEHRRecordNutritionForAppNames = async (model: FoodConsumptionDto) => {
        const eligibleToAddEhrRecord = await PatientAppNameCache.getEligibility(model.PatientUserId);
        if (eligibleToAddEhrRecord) {
            this.addEHRRecord(model, null);
        }
    };

}
