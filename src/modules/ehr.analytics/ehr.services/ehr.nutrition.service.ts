import { injectable } from "tsyringe";
import { EHRAnalyticsHandler } from "../ehr.analytics.handler";
import { EHRRecordTypes } from "../ehr.domain.models/ehr.record.types";
import { FoodConsumptionDto } from "../../../domain.types/wellness/nutrition/food.consumption/food.consumption.dto";
import { PatientAppNameCache } from "../patient.appname.cache";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class EHRNutritionService {

    public addEHRRecord = (model: FoodConsumptionDto, appNames?: string) => {
        if (model.FoodTypes[0] === "GenericNutrition") {
            EHRAnalyticsHandler.addNutritionRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                'Were most of your food choices healthy today?',
                model.UserResponse,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Fruits") {
            EHRAnalyticsHandler.addNutritionRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                null,
                null,
                model.Servings,
                null,
                null,
                null,
                null,
                null,
                null,
                model.ServingUnit,
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Vegetables") {
            EHRAnalyticsHandler.addNutritionRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                null,
                null,
                null,
                null,
                model.Servings,
                null,
                null,
                null,
                null,
                model.ServingUnit,
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Sugary drinks") {
            EHRAnalyticsHandler.addNutritionRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                null,
                null,
                null,
                model.Servings,
                null,
                null,
                null,
                null,
                null,
                model.ServingUnit,
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Salt") {
            EHRAnalyticsHandler.addNutritionRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                null,
                null,
                null,
                null,
                null,
                model.UserResponse,
                null,
                null,
                null,
                null,
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Sea food") {
            EHRAnalyticsHandler.addNutritionRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                null,
                null,
                null,
                null,
                null,
                null,
                model.Servings,
                null,
                null,
                model.ServingUnit,
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Grains") {
            EHRAnalyticsHandler.addNutritionRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                model.Servings,
                null,
                model.ServingUnit,
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
        if (model.FoodTypes[0] === "Protein") {
            EHRAnalyticsHandler.addNutritionRecord(
                model.PatientUserId,
                model.id,
                model.Provider,
                EHRRecordTypes.Nutrition,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                null,
                model.UserResponse,
                null,
                appNames,
                model.CreatedAt ? new Date(model.CreatedAt) : null
            );
        }
    };

    public addEHRRecordNutritionForAppNames = async (model: FoodConsumptionDto) => {
        const eligibleAppNames = await PatientAppNameCache.get(model.PatientUserId);
        var appNames = [];
        for (var appName of eligibleAppNames) {
            appNames.push(appName);
        }
        this.addEHRRecord(model, JSON.stringify(appNames));
    };

}
