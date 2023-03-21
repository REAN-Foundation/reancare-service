import { inject, injectable } from "tsyringe";
import { BodyWeightDomainModel } from '../../domain.types/clinical/biometrics/body.weight/body.weight.domain.model';
import { ConfigurationManager } from "../../config/configuration.manager";
import { BodyWeightStore } from "../../modules/ehr/services/body.weight.store";
import { Loader } from "../../startup/loader";
import { IPulseRepo } from "../../database/repository.interfaces/clinical/biometrics/pulse.repo.interface ";
import { IBodyTemperatureRepo } from "../..//database/repository.interfaces/clinical/biometrics/body.temperature.repo.interface";
import { IBloodPressureRepo } from "../../database/repository.interfaces/clinical/biometrics/blood.pressure.repo.interface";
import { IBloodOxygenSaturationRepo } from "../../database/repository.interfaces/clinical/biometrics/blood.oxygen.saturation.repo.interface";
import { IBloodGlucoseRepo } from "../../database/repository.interfaces/clinical/biometrics/blood.glucose.repo.interface";
import { AuthDomainModel } from "../../domain.types/webhook/auth.domain.model";
import { IPatientRepo } from "../../database/repository.interfaces/users/patient/patient.repo.interface";
import { ReAuthDomainModel } from "../../domain.types/webhook/reauth.domain.model";
import { NutritionDomainModel } from "../../domain.types/webhook/nutrition.domain.model";
import { FoodConsumptionEvents } from "../../domain.types/wellness/nutrition/food.consumption/food.consumption.types";
import { IFoodConsumptionRepo } from "../../database/repository.interfaces/wellness/nutrition/food.consumption.repo.interface";
import { FoodConsumptionDomainModel } from "../../domain.types/wellness/nutrition/food.consumption/food.consumption.domain.model";
import { ICalorieBalanceRepo } from "../../database/repository.interfaces/wellness/daily.records/calorie.balance.repo.interface";
import { ApiError } from "../../common/api.error";
import { IWaterConsumptionRepo } from "../../database/repository.interfaces/wellness/nutrition/water.consumption.repo.interface";
import { BodyDomainModel } from "../../domain.types/webhook/body.domain.model";

////////////////////////////////////////////////////////////////////////////////////////////////////////

@injectable()
export class TeraWebhookService {

    _ehrBodyWeightStore: BodyWeightStore = null;

    constructor(
        @inject('IPulseRepo') private _pulseRepo: IPulseRepo,
        @inject('IBodyTemperatureRepo') private _bodyTemperatureRepo: IBodyTemperatureRepo,
        @inject('IBloodPressureRepo') private _bloodPressureRepo: IBloodPressureRepo,
        @inject('IBloodOxygenSaturationRepo') private _bloodOxygenSaturationRepo: IBloodOxygenSaturationRepo,
        @inject('IBloodGlucoseRepo') private _bloodGlucoseRepo: IBloodGlucoseRepo,
        @inject('IPatientRepo') private _patientRepo: IPatientRepo,
        @inject('IFoodConsumptionRepo') private _foodConsumptionRepo: IFoodConsumptionRepo,
        @inject('ICalorieBalanceRepo') private _calorieBalanceRepo: ICalorieBalanceRepo,
        @inject('IWaterConsumptionRepo') private _waterConsumptionRepo: IWaterConsumptionRepo,
    ) {
        if (ConfigurationManager.EhrEnabled()) {
            this._ehrBodyWeightStore = Loader.container.resolve(BodyWeightStore);
        }
    }

    create = async (bodyWeightDomainModel: BodyWeightDomainModel) => {

        // var dto = await this._bloodCholesterolRepo.create(bodyWeightDomainModel);
    };

    auth = async (authDomainModel: AuthDomainModel) => {

        await this._patientRepo.terraAuth( authDomainModel.User.ReferenceId, authDomainModel);

    };

    reAuth = async (reAuthDomainModel: ReAuthDomainModel) => {

        await this._patientRepo.terraReAuth( reAuthDomainModel.NewUser.ReferenceId, reAuthDomainModel);

    };

    nutrition = async (nutritionDomainModel: NutritionDomainModel) => {

        const meals = nutritionDomainModel.Meals;
        meals.forEach(async meal => {
            const mealDomainModel : FoodConsumptionDomainModel = {
                PatientUserId : nutritionDomainModel.User.ReferenceId,
                Provider      : nutritionDomainModel.User.Provider,
                Food          : meal.Name,
                Servings      : meal.Quantity.Amount,
                ServingUnit   : meal.Quantity.Unit,
                ConsumedAs    : FoodConsumptionEvents.Other,
                Calories      : meal.Macros.Calories,
                StartTime     : new Date(nutritionDomainModel.MetaData.StartTime),
                EndTime       : new Date(nutritionDomainModel.MetaData.EndTime)
            };
            await this._foodConsumptionRepo.create(mealDomainModel);
        });

        // Adding calorie summary data in daily records
        const recordDate = nutritionDomainModel.MetaData.StartTime.split('T')[0];
        var existingRecord =
            await this._calorieBalanceRepo.getByRecordDate(new Date(recordDate), nutritionDomainModel.User.ReferenceId);
        if (existingRecord !== null) {
            const domainModel = {
                Provider         : nutritionDomainModel.User.Provider,
                CaloriesConsumed : existingRecord.CaloriesConsumed + nutritionDomainModel.Summary.Macros.Calories
            };
            var caloriesConsumed = await this._calorieBalanceRepo.update(existingRecord.id, domainModel);
        } else {
            const domainModel = {
                PatientUserId    : nutritionDomainModel.User.ReferenceId,
                Provider         : nutritionDomainModel.User.Provider,
                CaloriesConsumed : nutritionDomainModel.Summary.Macros.Calories,
                RecordDate       : new Date(nutritionDomainModel.MetaData.StartTime)
            };
            var caloriesConsumed = await this._calorieBalanceRepo.create(domainModel);
        }
        if (caloriesConsumed == null) {
            throw new ApiError(400, 'Cannot create Step Count!');
        }

        // Adding water summary data in daily records
        const waterDate = nutritionDomainModel.MetaData.StartTime.split('T')[0];
        var existingRecordWater =
            await this._waterConsumptionRepo.getByRecordDate(new Date(waterDate), nutritionDomainModel.User.ReferenceId);
        if (existingRecordWater !== null) {
            const waterDomainModel = {
                Provider : nutritionDomainModel.User.Provider,
                Volume   : existingRecordWater.Volume + nutritionDomainModel.Summary.WaterMl
            };
            var waterConsumed = await this._waterConsumptionRepo.update(existingRecordWater.id, waterDomainModel);
        } else {
            const waterDomainModel = {
                PatientUserId : nutritionDomainModel.User.ReferenceId,
                Provider      : nutritionDomainModel.User.Provider,
                Volume        : nutritionDomainModel.Summary.WaterMl,
                Time          : new Date(nutritionDomainModel.MetaData.StartTime)
            };
            var waterConsumed = await this._waterConsumptionRepo.create(waterDomainModel);
        }
        if (waterConsumed == null) {
            throw new ApiError(400, 'Cannot create water consumption!');
        }
    };

    body = async (bodyDomainModel: BodyDomainModel) => {

        const bodyData = bodyDomainModel.Data;
        bodyData.forEach(async body => {
           
            const bloodPressureSamples = body.BloodPressureData.BloodPressureSamples;
            bloodPressureSamples.forEach(async bp => {
                const bpDomainModel = {
                    PatientUserId : bodyDomainModel.User.ReferenceId,
                    Provider      : bodyDomainModel.User.Provider,
                    Systolic      : bp.SystolicBPmmHg,
                    Diastolic     : bp.DiastolicBPmmHg,
                    Unit          : "mmHg",
                    RecordDate    : new Date(bp.TimeStamp)
                };
                await this._bloodPressureRepo.create(bpDomainModel);

            });

            const bloodGlucoseSamples = body.GlucoseData.BloodGlucoseSamples;
            bloodGlucoseSamples.forEach(async bloodGluocse => {
                const bloodGlucoseDomainModel = {
                    PatientUserId : bodyDomainModel.User.ReferenceId,
                    Provider      : bodyDomainModel.User.Provider,
                    BloodGlucose  : bloodGluocse.BloodGlucoseMgPerDL,
                    Unit          : "mg/dL",
                    RecordDate    : new Date(bloodGluocse.TimeStamp)
                };
                await this._bloodGlucoseRepo.create(bloodGlucoseDomainModel);

            });

            const oxygenSamples = body.OxygenData.SaturationSamples;
            oxygenSamples.forEach(async bloodOxygen => {
                const bloodOxygenDomainModel = {
                    PatientUserId         : bodyDomainModel.User.ReferenceId,
                    Provider              : bodyDomainModel.User.Provider,
                    BloodOxygenSaturation : bloodOxygen.Percentage,
                    Unit                  : "%",
                    RecordDate            : new Date(bloodOxygen.TimeStamp)
                };
                await this._bloodOxygenSaturationRepo.create(bloodOxygenDomainModel);

            });

            const heartRateSamples = body.HeartData.HeartRateData.Detailed.HrSamples;
            heartRateSamples.forEach(async heartRate => {
                const heartRateDomainModel = {
                    PatientUserId : bodyDomainModel.User.ReferenceId,
                    Provider      : bodyDomainModel.User.Provider,
                    Pulse         : heartRate.BPM,
                    Unit          : "bpm",
                    RecordDate    : new Date(heartRate.TimeStamp)
                };
                await this._pulseRepo.create(heartRateDomainModel);

            });

            const tempSamples = body.TemperatureData.BodyTemperatureSamples;
            tempSamples.forEach(async bodyTemp => {
                const bodyTempDomainModel = {
                    PatientUserId   : bodyDomainModel.User.ReferenceId,
                    Provider        : bodyDomainModel.User.Provider,
                    BodyTemperature : bodyTemp.TemperatureCelsius,
                    Unit            : "°C",
                    RecordDate      : new Date(bodyTemp.TimeStamp)
                };
                await this._bodyTemperatureRepo.create(bodyTempDomainModel);

            });
        });
    };

    sleep = async (reAuthDomainModel: ReAuthDomainModel) => {

        await this._patientRepo.terraReAuth( reAuthDomainModel.NewUser.ReferenceId, reAuthDomainModel);

    };

    daily = async (reAuthDomainModel: ReAuthDomainModel) => {

        await this._patientRepo.terraReAuth( reAuthDomainModel.NewUser.ReferenceId, reAuthDomainModel);

    };

}
